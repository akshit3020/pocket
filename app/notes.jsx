import MasonryList from "@react-native-seoul/masonry-list";
import { router, useFocusEffect } from "expo-router";
import {
  NotePencilIcon,
  PencilSimpleIcon,
  PencilSimpleLineIcon,
  PushPinIcon,
  TextTIcon,
  X,
} from "phosphor-react-native";
import { useCallback, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../components/ScreenHeader";
import { useAppStore } from "../store/appstore";

const notes = () => {
  const { width } = Dimensions.get("window");

  const { notes, loadNotes } = useAppStore();

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, []),
  );

  // modal
  const [visible, setVisible] = useState(false);

  return (
    <SafeAreaView className="screen">
      <ScreenHeader
        showBackButton
        icon={NotePencilIcon}
        title="Your Notes"
        subtitle="Private & encrypted notes"
      />

      <View className="mt-8 flex-1">
        {notes.length === 0 ? (
          <View className="mt-10 flex-row items-center justify-center gap-1">
            <Text className="text-neutral-200">No notes yet. Tap </Text>
            <PencilSimpleIcon size={28} color="#e5e5e5" weight="regular" />
            <Text className="text-neutral-200"> to create one.</Text>
          </View>
        ) : (
          <MasonryList
            data={notes}
            // data={[...pinnedNotes, ...otherNotes]}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={{
              paddingHorizontal: 8,
              paddingBottom: 120,
            }}
            renderItem={({ item }) => {
              const isDrawNote = item.content?.startsWith("data:image");

              return (
                <View style={{ alignItems: "center" }}>
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: isDrawNote ? "/draw-note" : "/text-note",
                        params: { id: item.id },
                      })
                    }
                  >
                    <View
                      style={{
                        width: width / 2 - 20,
                        elevation: 0.5,
                        backgroundColor: item.color || "#171717",
                      }}
                      className="relative mb-3 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900"
                    >
                      {item.pinned === 1 && (
                        <View className="absolute right-0 top-0 z-10 flex-row items-center gap-1 rounded-bl-2xl rounded-tr-2xl border border-yellow-400/20 bg-yellow-400/10 px-2 py-1">
                          <PushPinIcon
                            size={11}
                            color="#fde047"
                            weight="fill"
                          />
                          <Text className="text-[9px] font-medium text-yellow-300">
                            Pinned
                          </Text>
                        </View>
                      )}

                      {isDrawNote ? (
                        // ── Draw note card ──────────────────────────────
                        <>
                          {/* Canvas thumbnail */}
                          <Image
                            source={{ uri: item.content }}
                            style={{ width: "100%", height: 350 }}
                            resizeMode="cover"
                          />
                          {/* Title strip */}
                          {item.title?.trim() ? (
                            <View className="border-t border-neutral-800 px-3 py-2">
                              <Text
                                className={`text-white} text-[13px] font-semibold`}
                                numberOfLines={1}
                              >
                                {item.title.trim()}
                              </Text>
                            </View>
                          ) : null}
                        </>
                      ) : (
                        // ── Text note card ──────────────────────────────
                        <View className="p-4">
                          <Text className="mb-1 font-semibold text-white">
                            {item.title.trim()}
                          </Text>
                          <Text
                            className={`text-sm text-neutral-400`}
                            numberOfLines={10}
                          >
                            {item.content.trim()}
                          </Text>
                        </View>
                      )}
                    </View>
                  </Pressable>
                </View>
              );
            }}
          />
        )}
      </View>

      {/* FAB */}
      <Pressable
        onPress={() => setVisible(true)}
        className="fab"
        // style={{ elevation: 1 }}
      >
        <PencilSimpleIcon size={28} color="white" weight="regular" />
      </Pressable>

      {/* Modal */}
      <Modal
        transparent
        visible={visible}
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          className="flex-1 justify-end"
          onPress={() => setVisible(false)}
        >
          <Pressable
            className="rounded-t-3xl border-t border-neutral-800 bg-neutral-900 px-6 pb-8 pt-5"
            onPress={(e) => e.stopPropagation()}
          >
            {/* Handle + close */}
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-white">New Note</Text>
              <TouchableOpacity
                onPress={() => setVisible(false)}
                className="h-10 w-10 items-center justify-center rounded-full bg-neutral-800"
                hitSlop={8}
              >
                <X size={18} color="#a3a3a3" />
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-around">
              {/* Text Note */}
              <Pressable
                onPress={() => {
                  setVisible(false);
                  router.push({
                    pathname: "/text-note",
                    params: { id: "" },
                  });
                }}
                className="items-center gap-2"
              >
                <View className={`rounded-2xl bg-indigo-600 p-4`}>
                  <TextTIcon size={28} color="white" />
                </View>

                <Text className="text-xs font-medium text-white">Text</Text>
              </Pressable>

              {/* Drawing */}
              <Pressable
                onPress={() => {
                  setVisible(false);
                  router.push({
                    pathname: "/draw-note",
                    params: { id: "" },
                  });
                }}
                className="items-center gap-2"
              >
                <View className={`rounded-2xl bg-indigo-600 p-4`}>
                  <PencilSimpleLineIcon
                    size={26}
                    color="white"
                    weight="duotone"
                  />
                </View>

                <Text className="text-xs font-medium text-white">Drawing</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default notes;
