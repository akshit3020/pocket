import { Tabs } from "expo-router";
import {
  ChatTeardropDotsIcon,
  HouseIcon,
  VaultIcon,
} from "phosphor-react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,

        tabBarStyle: {
          position: "absolute",
          backgroundColor: "#171717",
          borderWidth: 1,
          borderColor: "#262626",
          height: 72,
          marginHorizontal: 24,
          marginBottom: 24,
          borderRadius: 24,
        },

        tabBarItemStyle: {
          paddingTop: 6,
        },

        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#a3a3a3",

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginTop: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <HouseIcon
              weight="regular"
              size={focused ? 28 : 26}
              color={focused ? "#4338ca" : "#a3a3a3"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ focused }) => (
            <ChatTeardropDotsIcon
              weight="regular"
              size={focused ? 28 : 26}
              color={focused ? "#4338ca" : "#a3a3a3"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="vault"
        options={{
          title: "Vault",
          tabBarIcon: ({ focused }) => (
            <VaultIcon
              weight="regular"
              size={focused ? 28 : 26}
              color={focused ? "#4338ca" : "#a3a3a3"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
