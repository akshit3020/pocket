import { EyeIcon, EyeSlashIcon } from "phosphor-react-native";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  secure = false,
  keyboardType = "default",
  autoCapitalize = "sentences",
  optional = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="mb-4 gap-1.5">
      <Text className="text-xs font-medium text-neutral-400">
        {label}
        {optional && " (OPTIONAL)"}
      </Text>

      {secure ? (
        <View className="flex-row items-center rounded-2xl border border-neutral-800 bg-neutral-950 px-4">
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#525252"
            secureTextEntry={!showPassword}
            autoCapitalize={autoCapitalize}
            className="flex-1 py-3 text-white"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <EyeSlashIcon size={18} color="#737373" />
            ) : (
              <EyeIcon size={18} color="#737373" />
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#525252"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          className="rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white"
        />
      )}
    </View>
  );
}
