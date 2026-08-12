<GiftedChat
        minInputToolbarHeight={56}
        minComposerHeight={36}
        messages={formatted}
        onSend={onSend}
        user={{ _id: 1 }}
        placeholder="Write something..."
        alwaysShowSend
        renderAvatar={null}
        scrollToBottom
        infiniteScroll
        // ---- bubble styling ----
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: "#4f46e5", // indigo-600
                borderRadius: 20,
                marginVertical: 2,
              },
              left: {
                backgroundColor: "#171717", // neutral-900
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "#262626", // neutral-800
                marginVertical: 2,
              },
            }}
            textStyle={{
              right: { color: "#ffffff", fontSize: 15 },
              left: { color: "#ffffff", fontSize: 15 },
            }}
          />
        )}
        // ---- input bar ----
        renderInputToolbar={(props) => (
          <InputToolbar
            {...props}
            containerStyle={{
              backgroundColor: "#0a0a0a", // neutral-950
              borderTopWidth: 1,
              borderTopColor: "#262626",
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}
            primaryStyle={{ alignItems: "center" }}
          />
        )}
        renderComposer={(props) => (
          <View className="mx-2 my-1 min-h-[44px] flex-1 justify-center rounded-3xl border border-neutral-800 bg-neutral-900 px-4">
            <Composer
              {...props}
              textInputStyle={{
                color: "white",
                fontSize: 15,
                lineHeight: 20,
                paddingTop: 8,
                paddingBottom: 8,
              }}
              placeholderTextColor="#737373"
            />
          </View>
        )}
        renderSend={(props) => (
          <Send
            {...props}
            containerStyle={{ justifyContent: "center", paddingHorizontal: 8 }}
          >
            <View className="h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600">
              <MaterialIcons name="arrow-upward" size={20} color="white" />
            </View>
          </Send>
        )}
        // ---- date separators ----
        renderDay={(props) => (
          <Day {...props} textStyle={{ color: "#737373", fontSize: 12 }} />
        )}
      />