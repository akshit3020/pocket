import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeftIcon,
  CaretUpIcon,
  CheckIcon,
  DotsThreeVerticalIcon,
  EraserIcon,
  HighlighterIcon,
  PenNibIcon,
  TrashIcon,
} from "phosphor-react-native";
import { useEffect, useRef, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { useAppStore } from "../store/appstore";

const BRUSH_TYPES = [
  { label: "Pen", value: "pen", opacity: 1, lineCap: "round" },
  { label: "Marker", value: "marker", opacity: 0.85, lineCap: "square" },
  {
    label: "Highlighter",
    value: "highlighter",
    opacity: 0.35,
    lineCap: "butt",
  },
];

const BRUSH_COLORS = [
  "#000000",
  "#f87171",
  "#fbbf24",
  "#4ade80",
  "#38bdf8",
  "#c084fc",
  "#a16207",
];

const BRUSH_SIZES = [2, 4, 7, 11, 16, 22, 28];

const CANVAS_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <style>
    html, body { margin: 0; padding: 0; overflow: hidden; background: #ffffff; touch-action: none; }
    canvas { display: block; touch-action: none; }
  </style>
</head>
<body>
  <canvas id="canvas"></canvas>
  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.scale(dpr, dpr);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
    }
    resize();

    let drawing = false;
    let lastX = 0, lastY = 0;
    let tool = { color: '#000000', size: 4, opacity: 1, lineCap: 'round', erase: false };

    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches ? e.touches[0] : e;
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }

    function startDraw(e) {
      e.preventDefault();
      drawing = true;
      const pos = getPos(e);
      lastX = pos.x; lastY = pos.y;
    }

    function draw(e) {
      if (!drawing) return;
      e.preventDefault();
      const pos = getPos(e);
      ctx.globalCompositeOperation = tool.erase ? 'destination-out' : 'source-over';
      ctx.globalAlpha = tool.erase ? 1 : tool.opacity;
      ctx.strokeStyle = tool.color;
      ctx.lineWidth = tool.size;
      ctx.lineCap = tool.lineCap;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      lastX = pos.x; lastY = pos.y;
    }

    function endDraw(e) {
      drawing = false;
    }

    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', endDraw, { passive: false });
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', endDraw);

    // Receive commands from React Native
    document.addEventListener('message', handleMessage);
    window.addEventListener('message', handleMessage);

    function handleMessage(e) {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === 'setTool') {
          tool = { ...tool, ...msg.payload };
        } else if (msg.type === 'clear') {
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = 1;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (msg.type === 'export') {
          const dataUrl = canvas.toDataURL('image/png');
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'export', dataUrl }));
        } else if (msg.type === 'loadImage') {
          const img = new Image();
          img.onload = () => {
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1;
            ctx.drawImage(img, 0, 0, canvas.clientWidth, canvas.clientHeight);
          };
          img.src = msg.payload;
        }
      } catch (err) {}
    }
  </script>
</body>
</html>
`;

export default function DrawNote() {
  const { id } = useLocalSearchParams();
  const noteId = id;
  const router = useRouter();
  const webviewRef = useRef(null);

  const { notes, addNoteEntry, updateNoteEntry, deleteNoteEntry } =
    useAppStore();

  const [title, setTitle] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [sizePanelVisible, setSizePanelVisible] = useState(false);

  const [brushType, setBrushType] = useState("pen");
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(7);
  const [eraseMode, setEraseMode] = useState(false);

  const [existingContent, setExistingContent] = useState(null);
  const [webviewReady, setWebviewReady] = useState(false);

  useEffect(() => {
    if (noteId) {
      const note = notes.find((n) => String(n.id) === String(noteId));
      if (note) {
        setTitle(note.title);
        setExistingContent(note.content);
      }
    }
  }, [noteId]);

  // Once webview is loaded AND we have an existing drawing, push it in
  useEffect(() => {
    if (webviewReady && existingContent?.startsWith("data:image")) {
      sendToCanvas({ type: "loadImage", payload: existingContent });
    }
  }, [webviewReady, existingContent]);

  const sendToCanvas = (msg) => {
    webviewRef.current?.postMessage(JSON.stringify(msg));
  };

  const applyTool = (overrides = {}) => {
    const type = BRUSH_TYPES.find(
      (t) => t.value === (overrides.brushType ?? brushType),
    );
    sendToCanvas({
      type: "setTool",
      payload: {
        color: overrides.brushColor ?? brushColor,
        size: overrides.brushSize ?? brushSize,
        opacity: type.opacity,
        lineCap: type.lineCap,
        erase: overrides.eraseMode ?? eraseMode,
      },
    });
  };

  useEffect(() => {
    if (webviewReady) applyTool();
  }, [brushType, brushColor, brushSize, eraseMode, webviewReady]);

  const handleSave = () => {
    sendToCanvas({ type: "export" });
  };

  const onWebViewMessage = (event) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === "export") {
        persistNote(msg.dataUrl);
      }
    } catch (e) {}
  };

  const persistNote = (dataUrl) => {
    const now = new Date().toISOString();
    if (noteId) {
      updateNoteEntry(noteId, {
        title,
        content: dataUrl,
        updatedAt: now,
      });
    } else {
      addNoteEntry({
        id: Date.now().toString(),
        title,
        content: dataUrl,
        createdAt: now,
        updatedAt: now,
        pinned: 0,
      });
    }
    router.back();
  };

  const handleDelete = () => {
    setMenuVisible(false);
    Alert.alert("Delete drawing?", `Remove "${title || "Untitled"}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteNoteEntry(noteId);
          router.back();
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="screen">
      {/* Header */}
      <View className="mb-2 flex-row items-center justify-between border-b border-neutral-800 px-6 pb-4 pt-3">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeftIcon size={26} color="#fff" />
        </Pressable>

        <TextInput
          placeholder="Title"
          placeholderTextColor="#525252"
          value={title}
          onChangeText={setTitle}
          className="flex-1 px-4 text-base font-semibold text-white"
        />

        <View className="flex-row items-center gap-6">
          {noteId ? (
            <Pressable onPress={() => setMenuVisible((v) => !v)} hitSlop={8}>
              <DotsThreeVerticalIcon size={22} color="#fff" weight="bold" />
            </Pressable>
          ) : null}

          <Pressable
            onPress={handleSave}
            className="flex-row items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2"
            hitSlop={8}
          >
            <CheckIcon size={18} color="#fff" weight="bold" />
            <Text className="font-semibold text-white">Save</Text>
          </Pressable>
        </View>
      </View>

      {menuVisible && (
        <View className="absolute right-6 top-[64px] z-10 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
          <Pressable
            onPress={handleDelete}
            className="flex-row items-center gap-2 px-4 py-3.5"
          >
            <TrashIcon size={20} color="#f87171" />
            <Text className="text-sm font-medium text-red-400">
              Delete drawing
            </Text>
          </Pressable>
        </View>
      )}

      {/* Canvas */}
      <View className="mx-5 mt-3 flex-1 overflow-hidden rounded-2xl border border-neutral-800 bg-white">
        <WebView
          ref={webviewRef}
          source={{ html: CANVAS_HTML }}
          onMessage={onWebViewMessage}
          onLoadEnd={() => setWebviewReady(true)}
          scrollEnabled={false}
          style={{ flex: 1, backgroundColor: "#ffffff" }}
        />
      </View>

      {/* Toolbar */}
      <View className="gap-3 border-t border-neutral-800 bg-neutral-900 px-4 pb-6 pt-3">
        {/* Tool row: pen / marker / highlighter / eraser */}
        <View className="flex-row items-center justify-around">
          {BRUSH_TYPES.map((t) => (
            <Pressable
              key={t.value}
              onPress={() => {
                setEraseMode(false);
                setBrushType(t.value);
              }}
              className={`items-center justify-center rounded-xl px-4 py-2 ${
                !eraseMode && brushType === t.value
                  ? "bg-indigo-600"
                  : "bg-neutral-800"
              }`}
            >
              {t.value === "pen" ? (
                <PenNibIcon size={20} color="#fff" />
              ) : (
                <HighlighterIcon size={20} color="#fff" />
              )}
            </Pressable>
          ))}

          <Pressable
            onPress={() => setEraseMode((e) => !e)}
            className={`items-center justify-center rounded-xl px-4 py-2 ${
              eraseMode ? "bg-indigo-600" : "bg-neutral-800"
            }`}
          >
            <EraserIcon size={20} color="#fff" />
          </Pressable>

          <Pressable
            onPress={() => setSizePanelVisible((v) => !v)}
            className="items-center justify-center rounded-xl bg-neutral-800 px-4 py-2"
          >
            <View
              style={{
                width: Math.min(brushSize, 20),
                height: Math.min(brushSize, 20),
                borderRadius: 99,
                backgroundColor: "#fff",
              }}
            />
          </Pressable>

          <Pressable onPress={() => setSizePanelVisible((v) => !v)} hitSlop={8}>
            <CaretUpIcon size={16} color="#737373" />
          </Pressable>
        </View>

        {/* Color row */}
        <View className="flex-row items-center justify-around">
          {BRUSH_COLORS.map((c) => (
            <Pressable
              key={c}
              onPress={() => {
                setEraseMode(false);
                setBrushColor(c);
              }}
              style={{ backgroundColor: c }}
              className={`h-9 w-9 rounded-full border-2 ${
                brushColor === c && !eraseMode
                  ? "border-white"
                  : "border-neutral-700"
              }`}
            />
          ))}
        </View>

        {/* Size row (collapsible) */}
        {sizePanelVisible && (
          <View className="flex-row items-center justify-around pt-1">
            {BRUSH_SIZES.map((s) => (
              <Pressable
                key={s}
                onPress={() => setBrushSize(s)}
                className="h-10 w-10 items-center justify-center"
              >
                <View
                  style={{
                    width: s,
                    height: s,
                    borderRadius: 99,
                    backgroundColor: brushSize === s ? "#6366f1" : "#a3a3a3",
                  }}
                />
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
