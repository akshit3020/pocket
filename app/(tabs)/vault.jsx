import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Vault() {
  return (
    <SafeAreaView className="flex-1 bg-neutral-950 justify-center items-center">
      <Text className="text-white text-2xl font-semibold">
        Vault
      </Text>
    </SafeAreaView>
  );
}
