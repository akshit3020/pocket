import { X } from "phosphor-react-native";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import InputField from "../components/InputField";

const EMPTY = { title: "", username: "", password: "", website: "" };

export default function PasswordFormModal({
  visible,
  initialData,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(EMPTY);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setForm(initialData ? { ...EMPTY, ...initialData } : EMPTY);
    setShowPassword(false);
  }, [initialData, visible]);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = () => {
    if (!form.title.trim() || !form.password.trim()) return;
    onSave(form);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 justify-end bg-black/60" onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Pressable
            className="rounded-t-3xl border-t border-neutral-800 bg-neutral-900 px-6 pb-8 pt-5"
            onPress={(e) => e.stopPropagation()}
          >
            {/* heading + close */}
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-white">
                {initialData ? "Edit Password" : "New Password"}
              </Text>
              <TouchableOpacity
                onPress={onClose}
                className="h-10 w-10 items-center justify-center rounded-full bg-neutral-800"
                hitSlop={8}
              >
                <X size={18} color="#fff" />
              </TouchableOpacity>
            </View>

            <InputField
              label="TITLE"
              value={form.title}
              onChangeText={(v) => update("title", v)}
              placeholder="e.g. Google"
            />

            <InputField
              label="USERNAME / EMAIL"
              value={form.username}
              onChangeText={(v) => update("username", v)}
              placeholder="e.g. user@123"
              autoCapitalize="none"
            />

            <InputField
              label="PASSWORD"
              value={form.password}
              onChangeText={(v) => update("password", v)}
              placeholder="••••••••••"
              autoCapitalize="none"
              secure
            />

            <InputField
              label="WEBSITE"
              value={form.website}
              onChangeText={(v) => update("website", v)}
              placeholder="https://example.com"
              keyboardType="url"
              autoCapitalize="none"
              optional
            />

            {/* Save */}
            <TouchableOpacity
              onPress={handleSave}
              className="items-center rounded-2xl bg-indigo-600 py-4"
              activeOpacity={0.85}
            >
              <Text className="text-base font-semibold text-white">
                {initialData ? "Save Changes" : "Add Password"}
              </Text>
            </TouchableOpacity>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
