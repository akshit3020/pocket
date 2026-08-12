import { useActionSheet } from "@expo/react-native-action-sheet";
import { useHeaderHeight } from "@react-navigation/elements";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "expo-router";
import {
  ChatTeardropDotsIcon,
  PaperclipIcon,
  PaperPlaneTiltIcon,
} from "phosphor-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import {
  Bubble,
  Composer,
  GiftedChat,
  InputToolbar,
} from "react-native-gifted-chat";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import ScreenHeader from "../../components/ScreenHeader";
import { useAppStore } from "../../store/appstore";

export default function ChatScreen() {
  const insets = useSafeAreaInsets();

  const { messages, loadMessages, sendMessage } = useAppStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadMessages();
    setReady(true);
  }, []);

  const inputRef = useRef(null);
  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);

      return () => clearTimeout(timer);
    }, []),
  );
  const headerHeight = useHeaderHeight();

  // Gifted Chat expects newest-first, _id, createdAt, text, user
  const formatted = messages.map((m) => ({
    _id: m.id,
    text: m.content,
    createdAt: new Date(m.created_at),
    user: { _id: 1 }, // single user, always "you" //right-side
  }));

  const onSend = useCallback((newMessages = []) => {
    const msg = newMessages[0];
    // newMessages looks like:
    // [
    //   {
    //     _id: "temp-id",
    //     text: "Hello",
    //     createdAt: new Date(),
    //     user: { _id: 1 }
    //   }
    // ]
    sendMessage(msg.text); // writes to SQLite, updates store
  }, []);

  const { showActionSheetWithOptions } = useActionSheet();

  const openAttachmentMenu = () => {
    const options = ["Camera", "Gallery", "Document", "Cancel"];
    const cancelButtonIndex = 3;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (selectedIndex) => {
        switch (selectedIndex) {
          case 0: {
            const permission =
              await ImagePicker.requestCameraPermissionsAsync();

            if (!permission.granted) {
              alert("Camera permission is required.");
              return;
            }

            const image = await ImagePicker.launchCameraAsync({
              mediaTypes: ["images"],
              allowsEditing: true,
              quality: 1,
            });

            if (!image.canceled) {
              console.log(image.assets[0]);
            }

            break;
          }

          case 1:
            const image = await ImagePicker.launchImageLibraryAsync();
            if (!image.canceled) {
              console.log(image.assets[0]);
            }
            break;

          case 2:
            const doc = await DocumentPicker.getDocumentAsync();
            if (!doc.canceled) {
              console.log(doc.assets[0]);
            }
            break;

          default:
            break;
        }
      },
    );
  };

  if (!ready) return <SafeAreaView className="screen" />;

  return (
    // <SafeAreaView className="screen">
    //   <ScreenHeader
    //     showBackButton
    //     icon={ChatTeardropDotsIcon}
    //     title="Yourself"
    //     subtitle="Your private space"
    //   />
    <View className="screen">
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          paddingTop: insets.top,
          zIndex: 10,
          backgroundColor: "#0a0a0a",
        }}
      >
        <ScreenHeader
          showBackButton
          icon={ChatTeardropDotsIcon}
          title="Yourself"
          subtitle="Your private space"
        />
      </View>

      <GiftedChat
        // style={{ flex: 1, backgroundColor: "#0a0a0a" }}
        messages={formatted}
        onSend={onSend}
        user={{ _id: 1 }}
        keyboardAvoidingViewProps={{ keyboardVerticalOffset: headerHeight }}
        textInputProps={{
          autoFocus: true,
          placeholder: "type your message...",
          placeholderTextColor: "#a3a3a3",
        }}
        // alwaysShowSend
        renderAvatar={null}
        scrollToBottom
        infiniteScroll
        // ---- bubble styling ----
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: "#4f46e5", // indigo-600
                // borderRadius: 10,
                marginVertical: 2,
              },
              // left: {
              // },
            }}
            textStyle={{
              right: { color: "#ffffff", fontSize: 15, lineHeight: 20 },
              left: { color: "#ffffff", fontSize: 15, lineHeight: 20 },
            }}
            timeTextStyle={{
              right: { color: "#171717", fontSize: 11, fontWeight: "600" },
              left: { color: "#171717", fontSize: 11, fontWeight: "600" },
            }}
          />
        )}
        // ---- input bar ----
        renderInputToolbar={(props) => (
          <InputToolbar
            {...props}
            containerStyle={{
              backgroundColor: "#0a0a0a", // neutral-950
              borderTopWidth: 1,
              borderTopColor: "#262626",
              paddingHorizontal: 24,
              paddingTop: 12,
              paddingBottom: 20,
              display: "flex",
              flexDirection: "row",
              justifyContent: "between",
              alignItems: "center",
            }}
          />
        )}
        renderActions={() => (
          <TouchableOpacity
            onPress={openAttachmentMenu}
            className="h-12 w-12 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900"
          >
            <PaperclipIcon size={24} color="white" />
          </TouchableOpacity>
        )}
        renderComposer={(props) => (
          <View className="mx-4 flex-1 justify-center rounded-lg border border-neutral-800 bg-neutral-900 pl-2">
            <Composer
              {...props}
              textInputStyle={{ color: "white", fontSize: 15 }}
              textInputProps={{
                ...props.textInputProps,
                ref: inputRef,
              }}
            />
          </View>
        )}
        renderSend={(props) => (
          <TouchableOpacity
            onPress={() => props.onSend?.({ text: props.text }, true)}
            className="h-12 w-12 items-center justify-center rounded-lg bg-indigo-600"
          >
            <PaperPlaneTiltIcon size={24} color="white" />
          </TouchableOpacity>
        )}
        // // ---- date separators ----
        // renderDay={(props) => (
        //   <Day {...props} textStyle={{ color: "red", fontSize: 12 }} />
        // )}
      />
    </View>
    // </SafeAreaView>
  );
}
