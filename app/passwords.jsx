import * as Clipboard from "expo-clipboard";
import { useFocusEffect } from "expo-router";
import {
  CopyIcon,
  EyeIcon,
  EyeSlashIcon,
  MinusCircleIcon,
  PasswordIcon,
  PencilSimple,
  Plus,
} from "phosphor-react-native";
import { useCallback, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../components/ScreenHeader";
import { useAppStore } from "../store/appstore";
import PasswordFormModal from "./passwordFormModal";

function getFaviconUrl(title) {
  const domain = title.toLowerCase().replace(/\s+/g, "") + ".com";
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

async function copyToClipboard(value, label) {
  await Clipboard.setStringAsync(value);
  Alert.alert("Copied", `${label} copied to clipboard`);
}

function PasswordItem({ item, onEdit, onDelete }) {
  const [textVisible, setTextVisible] = useState(false);
  const [iconError, setIconError] = useState(false);

  return (
    <View className="box flex-row items-center">
      <View className="h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-indigo-600">
        {!iconError ? (
          <Image
            source={{ uri: getFaviconUrl(item.title) }}
            className="h-7 w-7"
            resizeMode="contain"
            onError={() => setIconError(true)}
          />
        ) : (
          <Text className="m-0 p-0 text-[22px] font-bold text-white">
            {item.title.charAt(0).toUpperCase()}
          </Text>
        )}
      </View>

      <View className="ml-5 flex-1">
        <Text className="mb-2 text-lg font-semibold text-white">
          {item.title}
        </Text>
        {/* Username */}
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-md text-neutral-400">{item.username}</Text>

          <TouchableOpacity
            onPress={() => copyToClipboard(item.username, "Username")}
            hitSlop={8}
          >
            <CopyIcon size={16} color="#a3a3a3" />
          </TouchableOpacity>
        </View>

        {/* Password */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Text className="text-md tracking-widest text-neutral-400">
              {textVisible ? item.password : "••••••••••"}
            </Text>

            <TouchableOpacity
              onPress={() => setTextVisible((v) => !v)}
              hitSlop={8}
            >
              {textVisible ? (
                <EyeSlashIcon size={18} color="#a3a3a3" />
              ) : (
                <EyeIcon size={18} color="#a3a3a3" />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => copyToClipboard(item.password, "Password")}
            hitSlop={8}
          >
            <CopyIcon size={16} color="#a3a3a3" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Right actions */}
      <View className="ml-8 justify-between">
        <TouchableOpacity
          onPress={() => onEdit(item)}
          className="h-10 w-10 items-center justify-center rounded-xl bg-neutral-800"
        >
          <PencilSimple size={18} color="#a3a3a3" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            Alert.alert("Delete password?", `Remove "${item.title}"?`, [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete",
                style: "destructive",
                onPress: () => onDelete(item.id),
              },
            ])
          }
          className="mt-3 h-10 w-10 items-center justify-center rounded-xl bg-neutral-800"
        >
          <MinusCircleIcon size={18} color="#f87171" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function PasswordsScreen() {
  const {
    passwords,
    loadPasswords,
    addPasswordEntry,
    updatePasswordEntry,
    deletePasswordEntry,
  } = useAppStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadPasswords();
    }, []),
  );

  const handleSave = (data) => {
    if (editingItem) {
      updatePasswordEntry(editingItem.id, data);
    } else {
      addPasswordEntry(data);
    }
    setModalVisible(false);
    setEditingItem(null);
  };

  return (
    <SafeAreaView className="screen">
      <ScreenHeader
        showBackButton
        icon={PasswordIcon}
        title="Your Passwords"
        subtitle="Logins, credentials & secrets"
      />

      {/* List */}
      <ScrollView className="scroll" showsVerticalScrollIndicator={false}>
        <View className="gap-5 pb-24">
          {passwords.length === 0 ? (
            <View className="mt-10 flex-row items-center justify-center gap-1">
              <Text className="text-neutral-200">
                No passwords saved yet. Tap{" "}
              </Text>
              <Plus size={28} color="#e5e5e5" weight="bold" />
              <Text className="text-neutral-200"> to add one.</Text>
            </View>
          ) : (
            passwords.map((item) => (
              <PasswordItem
                key={item.id}
                item={item}
                onEdit={(item) => {
                  setEditingItem(item);
                  setModalVisible(true);
                }}
                onDelete={deletePasswordEntry}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        onPress={() => {
          setEditingItem(null);
          setModalVisible(true);
        }}
        className="fab"
        activeOpacity={0.85}
      >
        <Plus size={28} color="white" weight="bold" />
      </TouchableOpacity>

      <PasswordFormModal
        visible={modalVisible}
        initialData={editingItem}
        onClose={() => {
          setModalVisible(false);
          setEditingItem(null);
        }}
        onSave={handleSave}
      />
    </SafeAreaView>
  );
}
