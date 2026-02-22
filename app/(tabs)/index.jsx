import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import pocketData from "../../constant/pocketData.json";


export default function Index() {
  const router = useRouter();

  const { messages, safe } = pocketData;

  const totalSafeItems =
    safe.passwords + safe.notes + safe.images + safe.documents;

  const lastMessage = messages[0];
  
  return (
    <SafeAreaView className="flex-1 bg-neutral-950">
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      {/* Header */}
      <View className="px-6 pt-6 pb-10">

        {/* Small Product Label */}
        <Text className="text-neutral-400 text-xs tracking-[2px] uppercase">
          Private Storage
        </Text>

        {/* App Name */}
        <Text className="text-white text-4xl font-semibold mt-2">
          Pocket
        </Text>

        {/* Tagline */}
        <Text className="text-neutral-400 text-base mt-2 leading-7 ">
          A secure space for your personal messages, passwords, and important files — all stored privately on your device.
        </Text>

      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="px-6"
      >       

        {/* Overview Section */}
        <View className="mb-10">

          <View className="mb-4">
            <Text className="text-white text-xl font-semibold">
              Your Space
            </Text>
            {/* <Text className="text-neutral-500 text-sm mt-2 leading-5">
              Everything stored here stays private and securely protected within your device.
            </Text> */}
          </View>

          {/* Cards */}
          <View className="flex-row justify-between">

            {/* Messages Card */}
            <View className="bg-neutral-900 p-4 rounded-3xl w-[48%] border border-neutral-800">
              <View className="flex-row items-center justify-between">
                <Text className="text-neutral-400 text-xs tracking-widest uppercase">
                  Messages
                </Text>
                <View className="bg-indigo-600/15 px-2 py-1 rounded-full">
                  <Text className="text-indigo-400 text-[10px] tracking-wide">
                    Private
                  </Text>
                </View>
              </View>

              <Text className="text-white text-3xl font-semibold mt-4">
                {messages.length}
              </Text>

              <Text className="text-neutral-500 text-xs mt-2 leading-4">
                Personal notes and reminders kept entirely private
              </Text>
            </View>

            {/* Vault Card */}
            <View className="bg-neutral-900 p-4 rounded-3xl w-[48%] border border-neutral-800">
              <View className="flex-row items-center justify-between">
                <Text className="text-neutral-400 text-xs tracking-widest uppercase">
                  Vault
                </Text>
                <View className="bg-emerald-600/15 px-2 py-1 rounded-full">
                  <Text className="text-emerald-400 text-[10px] tracking-wide">
                    Encrypted
                  </Text>
                </View>
              </View>

              <Text className="text-white text-3xl font-semibold mt-4">
                {totalSafeItems}
              </Text>

              <Text className="text-neutral-500 text-xs mt-2 leading-4">
                Encrypted passwords, documents and secure records
              </Text>
            </View>

          </View>
        </View>

        {/* Personal Messages */}
        <View className="mb-10">

          {/* Section Title */}
          <Text className="text-neutral-400 text-xs tracking-[2px] uppercase mb-4">
            Personal messages
          </Text>

          <TouchableOpacity 
            onPress={() => router.push("/chat")} 
            className="flex-row items-center bg-neutral-900 px-5 py-4 rounded-3xl border border-neutral-800"
          >

            {/* Avatar */}
            <View className="w-14 h-14 rounded-full bg-indigo-600 items-center justify-center mr-4">
              <Text className="text-white text-lg font-semibold">
                Y
              </Text>
            </View>

            {/* Chat Info */}
            <View className="flex-1">
              <View className="flex-row justify-between items-center">
                <Text className="text-white text-base font-semibold">
                  Yourself
                </Text>

                <Text className="text-neutral-500 text-xs">
                  {new Date(lastMessage.timestamp).toLocaleDateString()}
                </Text>
              </View>

              <Text
                numberOfLines={1}
                className="text-neutral-400 text-sm mt-1"
              >
                last message
              </Text>
            </View>

          </TouchableOpacity>
        </View>

        {/* Vault */}
        <View className="mb-24">

          {/* Section Label */}
          <Text className="text-neutral-400 text-xs tracking-[2px] uppercase mb-6">
            Vault
          </Text>

          <View className="flex-row flex-wrap justify-between">

            {[
              { title: "Passwords", value: safe.passwords, icon: "password" },
              { title: "Notes", value: safe.notes, icon: "notes" },
              { title: "Images", value: safe.images, icon: "perm-media" },
              { title: "Documents", value: safe.documents, icon: "folder" },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                className="bg-neutral-900 border border-neutral-800 p-4 rounded-3xl w-[48%] mb-5"
              >

                {/* Icon */}
                <View className="w-10 h-10 rounded-xl bg-indigo-600/15 items-center justify-center">
                  <MaterialIcons
                    name={item.icon}
                    size={22}
                    color="#A5B4FC"
                  />
                </View>

                {/* Title */}
                <Text className="text-white mt-5 text-base font-semibold">
                  {item.title}
                </Text>

                {/* Count */}
                <Text className="text-neutral-500 text-sm mt-2">
                  {item.value} stored
                </Text>

              </TouchableOpacity>
            ))}

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
