import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeftIcon,
  CheckIcon,
  DotsThreeVerticalIcon,
  PushPinIcon,
  TrashIcon,
} from "phosphor-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "../store/appstore";

export default function TextNote() {
  const { id } = useLocalSearchParams();
  const noteId = id;
  const router = useRouter();

  const {
    notes,
    addNoteEntry,
    updateNoteEntry,
    deleteNoteEntry,
    togglePinnedEntry,
  } = useAppStore();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pinned, setPinned] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const NOTE_COLORS = [
    { label: "Default", value: "#171717", picker: "#525252" }, // neutral-900 and 600
    { label: "Red", value: "#450a0a", picker: "#dc2626" }, // red-950 and 600
    { label: "Blue", value: "#172554", picker: "#2563eb" }, // blue-950 and 600
    { label: "Purple", value: "#2e1065", picker: "#9333ea" }, // violet-950 and 600
    { label: "Green", value: "#052e16", picker: "#16a34a" }, // green-950 and 600
    { label: "Amber", value: "#451a03", picker: "#d97706" }, // amber/brown-950 and 600
  ];
  const [color, setColor] = useState("#171717");

  useEffect(() => {
    if (noteId) {
      const note = notes.find((n) => String(n.id) === String(noteId));
      if (note) {
        setTitle(note.title);
        setContent(note.content);
        setPinned(note.pinned === 1);
        setColor(note.color || "#171717");
      }
    }
  }, [noteId]);

  const saveNote = () => {
    if (!title.trim() && !content.trim()) return router.back();

    const now = new Date().toISOString();

    if (noteId) {
      updateNoteEntry(noteId, {
        title,
        content,
        updatedAt: now,
        pinned: pinned ? 1 : 0,
        color,
      });
    } else {
      addNoteEntry({
        id: Date.now().toString(),
        title,
        content,
        createdAt: now,
        updatedAt: now,
        pinned: pinned ? 1 : 0,
        color,
      });
    }
    router.back();
  };

  const togglePin = () => {
    setPinned((p) => !p);
    if (noteId) togglePinnedEntry(noteId, !pinned ? 1 : 0);
  };

  const handleDelete = () => {
    setMenuVisible(false);
    Alert.alert("Delete note?", `Remove "${title || "Untitled"}"?`, [
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

        <View className="flex-row items-center gap-6">
          <Pressable onPress={togglePin} hitSlop={8}>
            <PushPinIcon
              size={22}
              color={pinned ? "#facc15" : "#fff"}
              weight={pinned ? "fill" : "regular"}
            />
          </Pressable>

          {noteId ? (
            <Pressable onPress={() => setMenuVisible((v) => !v)} hitSlop={8}>
              <DotsThreeVerticalIcon size={22} color="#fff" weight="bold" />
            </Pressable>
          ) : null}

          <Pressable
            onPress={saveNote}
            className="flex-row items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2"
            hitSlop={8}
          >
            <CheckIcon size={18} color="#fff" weight="bold" />
            <Text className="font-semibold text-white">Save</Text>
          </Pressable>
        </View>
      </View>

      {/* Dropdown menu */}
      {menuVisible && (
        <View className="absolute right-6 top-[100px] z-10 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
          <Pressable
            onPress={handleDelete}
            className="flex-row items-center gap-2 border-b border-neutral-800 px-4 py-3.5"
          >
            <TrashIcon size={20} color="#f87171" />
            <Text className="text-sm font-medium text-red-400">
              Delete note
            </Text>
          </Pressable>

          <View className="px-4 py-3.5">
            <Text className="mb-2 text-xs font-medium text-neutral-200">
              Note color
            </Text>
            <View className="flex-row gap-2">
              {NOTE_COLORS.map((c) => (
                <Pressable
                  key={c.value}
                  onPress={() => setColor(c.value)}
                  // style={{ backgroundColor: c.value }}
                  style={{ backgroundColor: c.picker }}
                  className={`h-8 w-8 rounded-full border-2 ${
                    color === c.value ? "border-white" : "border-neutral-700"
                  }`}
                />
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Body */}
      <Pressable onPress={() => setMenuVisible(false)} className="flex-1">
        <ScrollView
          className="mx-5 mt-3 flex-1 rounded-2xl border border-neutral-800 bg-neutral-900 px-4 py-3"
          keyboardShouldPersistTaps="handled"
          style={{ backgroundColor: color }}
        >
          <TextInput
            placeholder="Title"
            placeholderTextColor="#525252"
            value={title}
            onChangeText={setTitle}
            className="pb-2 pt-2 text-[21px] font-semibold text-white"
          />
          <TextInput
            placeholder="Write your note..."
            placeholderTextColor="#525252"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            className="flex-1 pb-6 text-[18px] leading-6 text-neutral-200"
          />
        </ScrollView>
      </Pressable>
    </SafeAreaView>
  );
}
