import { MaterialIcons } from "@expo/vector-icons";
import {
  Airplane,
  Briefcase,
  CurrencyDollar,
  FileDocIcon,
  FolderPlus,
  FolderSimple,
  Heart,
  Scales,
  UploadSimple,
  User,
} from "phosphor-react-native";
import { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "../components/InputField";
import ScreenHeader from "../components/ScreenHeader";
import SectionHeader from "../components/SectionHeader";

const DEFAULT_FOLDERS = [
  { id: "personal", name: "Personal", icon: User },
  { id: "work", name: "Work", icon: Briefcase },
  { id: "finance", name: "Finance", icon: CurrencyDollar },
  { id: "health", name: "Health", icon: Heart },
  { id: "legal", name: "Legal", icon: Scales },
  { id: "travel", name: "Travel", icon: Airplane },
];

export default function DocumentsScreen() {
  const [folders, setFolders] = useState(DEFAULT_FOLDERS);
  const [showModal, setShowModal] = useState(false);
  const [folderName, setFolderName] = useState("");

  const createFolder = () => {
    if (!folderName.trim()) return;
    setFolders((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: folderName.trim(),
        icon: FolderSimple,
      },
    ]);
    setFolderName("");
    setShowModal(false);
  };

  const handleImport = () => {
    // wire up expo-document-picker here
  };

  return (
    <SafeAreaView className="screen">
      <ScreenHeader
        icon={FileDocIcon}
        title="Documents"
        subtitle="Your files, organized"
      />

      <ScrollView
        className="scroll"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 96 }}
      >
        {/* Action Buttons */}
        <View className="mb-8 flex-row gap-3">
          <TouchableOpacity
            onPress={() => setShowModal(true)}
            className="box flex-1 flex-row items-center justify-center gap-2 py-3.5"
          >
            <FolderPlus size={18} color="#4f46e5" weight="bold" />
            <Text className="font-semibold text-indigo-600">New Folder</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleImport}
            className="flex-1 flex-row items-center justify-center gap-2 rounded-3xl bg-indigo-600 py-3.5"
          >
            <UploadSimple size={18} color="white" weight="bold" />
            <Text className="font-semibold text-white">Import</Text>
          </TouchableOpacity>
        </View>

        <SectionHeader title="Folders" subtitle />

        <View className="gap-5">
          {folders.map((folder) => (
            <TouchableOpacity
              key={folder.id}
              className="box flex-row items-center"
            >
              {/* Icon */}
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600">
                <folder.icon size={24} color="white" weight="fill" />
              </View>

              {/* Text */}
              <View className="ml-4 flex-1">
                <Text className="text-lg font-semibold text-white">
                  {folder.name}
                </Text>
                <Text className="mt-0.5 text-sm text-neutral-500">0 files</Text>
              </View>

              <MaterialIcons name="chevron-right" size={28} color="white" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* New Folder Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity
          className="flex-1 items-center justify-center bg-black/60 px-6"
          onPress={() => {
            setShowModal(false);
            setFolderName("");
          }}
        >
          {/* stop tap-through */}
          <TouchableOpacity activeOpacity={1} className="w-full">
            <View className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6">
              {/* Title */}
              <View className="mb-4 flex-row items-center gap-3">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600">
                  <FolderPlus size={24} color="white" weight="regular" />
                </View>
                <View>
                  <Text className="text-lg font-bold text-white">
                    New Folder
                  </Text>
                </View>
              </View>

              {/* Input
              <TextInput
                className="mb-5 rounded-2xl border border-neutral-700 bg-neutral-800 px-4 py-3.5 text-white"
                placeholder="Folder name"
                placeholderTextColor="#525252"
                value={folderName}
                onChangeText={setFolderName}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={createFolder}
              /> */}

              <InputField
                label="Give your folder a name"
                value={folderName}
                onChangeText={setFolderName}
                placeholder="Folder name"
              />

              {/* Buttons */}
              <View className="flex-row gap-3">
                <TouchableOpacity
                  className="box flex-1 items-center"
                  onPress={() => {
                    setShowModal(false);
                    setFolderName("");
                  }}
                >
                  <Text className="font-semibold text-neutral-400">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="box flex-1 items-center bg-indigo-600"
                  onPress={createFolder}
                >
                  <Text className="font-semibold text-white">Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
