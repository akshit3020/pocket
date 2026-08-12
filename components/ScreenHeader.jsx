import { router } from "expo-router";
import { CaretLeftIcon } from "phosphor-react-native";
import { Pressable, Text, View } from "react-native";

export default function ScreenHeader({
  icon: Icon,
  title,
  subtitle,
  iconColor = "#4f46e5",
  iconSize = 32,
  iconWeight = "regular",
  showBackButton = false,
}) {
  return (
    <View className="border-b border-neutral-800 px-6 py-3">
      <View className="flex-row items-center gap-5">
        {showBackButton && (
          <Pressable onPress={() => router.back()}>
            <CaretLeftIcon size={24} color="#fff" weight="bold" />
          </Pressable>
        )}
        <View className="flex-1 flex-row items-center gap-3">
          <View className="h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10">
            <Icon size={iconSize} color={iconColor} weight={iconWeight} />
          </View>
          <View className="gap-1">
            <Text className="text-2xl font-bold text-white">{title}</Text>
            {subtitle && (
              <Text className="text-sm text-neutral-400">{subtitle}</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
