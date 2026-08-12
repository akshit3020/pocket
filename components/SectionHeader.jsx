import { Text, View } from "react-native";

export default function SectionHeader({ title, subtitle = false }) {
  if (subtitle) {
    return (
      <Text className="mb-4 text-sm uppercase tracking-[2px] text-neutral-200">
        {title}
      </Text>
    );
  }

  return (
    <View className="mb-4">
      <Text className="text-xl font-semibold text-white">{title}</Text>
    </View>
  );
}
