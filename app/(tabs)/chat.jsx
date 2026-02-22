import { Feather } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useCallback, useState } from "react";
import { StatusBar, Text, View } from "react-native";
import { Bubble, GiftedChat, InputToolbar, Send } from "react-native-gifted-chat";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatScreen() {
  const tabBarHeight = useBottomTabBarHeight();

  const [messages, setMessages] = useState([
    {
      _id: 1,
      text: "Welcome to your private space.",
      createdAt: new Date(),
      user: { _id: 1 },
    },
  ]);

  const onSend = useCallback((newMessages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
  }, []);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-neutral-950">
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      
      {/* Header */}
      <View className="pt-6 px-6 pb-4 border-b border-neutral-900">
        <Text className="text-white text-xl font-semibold">
          Yourself
        </Text>
        <Text className="text-neutral-400 text-xs tracking-[2px] uppercase mt-3">
            Personal messages
          </Text>
      </View>

      {/* <View style={{ flex: 1, paddingBottom: tabBarHeight + 20 }}> */}
      <View style={{ flex: 1}}>
        <View style={{ flex: 1 }}>
  <GiftedChat
    messages={messages}
    onSend={(messages) => onSend(messages)}
    user={{ _id: 1 }}

    bottomOffset={tabBarHeight + 20}   // 🔥 KEY FIX

    renderBubble={(props) => (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#6366F1",
            borderRadius: 20,
          },
        }}
      />
    )}

    renderInputToolbar={(props) => (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: "#111111",
          borderTopWidth: 0,
        }}
      />
    )}

    renderSend={(props) => (
      <Send {...props}>
        <View style={{ marginRight: 12, marginBottom: 6 }}>
          <Feather name="send" size={20} color="#A5B4FC" />
        </View>
      </Send>
    )}

    alwaysShowSend
    placeholder="Write something..."
    textInputStyle={{ color: "#fff" }}
  />
</View>
      </View>

    </SafeAreaView>
  );
}