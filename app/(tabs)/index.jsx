import { VAULT_ITEMS } from "@/constants/vaultItems";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OverviewCard from "../../components/OverviewCard";
import SectionHeader from "../../components/SectionHeader";
import { useAppStore } from "../../store/appstore";

export default function Index() {
  const router = useRouter();

  const {
    messagesCount,
    vaultCount,
    lastMessage,
    passwordsCount,
    notesCount,
    imagesCount,
    documentsCount,
    loadCounts,
  } = useAppStore();

  useFocusEffect(
    useCallback(() => {
      loadCounts(); // re-fetches every time screen is focused
    }, []),
  );

  const counts = {
    Passwords: passwordsCount,
    Notes: notesCount,
    Images: imagesCount,
    Documents: documentsCount,
  };

  const vaultItemsWithCounts = VAULT_ITEMS.map((item) => ({
    ...item,
    value: counts[item.title],
  }));

  return (
    <SafeAreaView className="screen">
      {/* Header */}
      <View className="gap-3 px-6 pt-3">
        {/* Small Product Label */}
        <Text className="text-xs uppercase tracking-[2px] text-neutral-400">
          Personal Secure Storage
        </Text>

        {/* App Name */}
        <Text className="text-4xl font-semibold text-white">Pocket</Text>

        {/* Tagline */}
        <Text className="text-base leading-7 text-neutral-400">
          Your private space for messages, passwords, and essential files —
          securely stored on your device, with an optional encrypted cloud
          backup.
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="scroll">
        {/* Overview Section */}
        <View className="mb-8">
          <SectionHeader title="Your Space" />

          {/* Cards */}
          <View className="flex-row justify-between">
            {/* Messages Card */}
            <OverviewCard
              title="Messages"
              value={messagesCount}
              description="Personal notes and reminders, kept entirely private."
            />

            {/* Vault Card */}
            <OverviewCard
              title="Vault"
              value={vaultCount}
              description="Securely encrypted passwords, documents, and sensitive records."
            />
          </View>
        </View>

        {/* Personal Messages */}
        <View className="mb-8">
          <SectionHeader title="Messages" subtitle />

          <TouchableOpacity
            onPress={() => router.push("/chat")}
            className="box flex-row items-center"
          >
            {/* Avatar */}
            <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-indigo-600">
              <Text className="text-lg font-semibold text-white">Y</Text>
            </View>

            {/* Chat Info */}
            <View className="flex-1">
              <View className="flex-row items-center justify-between">
                <Text className="text-base font-semibold text-white">
                  Yourself
                </Text>

                <Text className="text-xs text-neutral-500">
                  {lastMessage
                    ? new Date(lastMessage.created_at).toLocaleDateString()
                    : ""}
                </Text>
              </View>

              <Text numberOfLines={1} className="mt-1 text-sm text-neutral-400">
                {lastMessage?.content || "No messages yet"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Vault */}
        <View className="mb-24">
          <SectionHeader title="Vault" subtitle />

          <View className="flex-row flex-wrap justify-between">
            {vaultItemsWithCounts.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => router.push(item.route)}
                className="box mb-5 w-[48%]"
              >
                <View className="flex-row items-center justify-start gap-4">
                  <View className="h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
                    <MaterialIcons name={item.icon} size={22} color="white" />
                  </View>
                  <View>
                    <Text className="text-base font-semibold text-white">
                      {item.title}
                    </Text>
                    <Text className="text-sm text-neutral-500">
                      {item.value} stored
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
