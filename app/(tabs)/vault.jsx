import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { Vault } from "phosphor-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../../components/ScreenHeader";
import { VAULT_ITEMS } from "../../constants/vaultItems";

export default function VaultScreen({ safe }) {
  return (
    <SafeAreaView className="screen">
      <ScreenHeader
        icon={Vault}
        title="Vault"
        subtitle="All your secured items in one place"
      />

      <ScrollView className="scroll">
        {/* List */}
        <View className="gap-5">
          {VAULT_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => router.push(item.route)}
              className="box flex-row items-center"
            >
              {/* Icon */}
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600">
                <MaterialIcons name={item.icon} size={24} color="white" />
              </View>

              {/* Text */}
              <View className="ml-4 flex-1">
                <Text className="text-lg font-semibold text-white">
                  {item.title}
                </Text>
                <Text className="mt-0.5 text-sm text-neutral-400">
                  {item.description}
                </Text>
              </View>

              <MaterialIcons name="chevron-right" size={28} color="white" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
