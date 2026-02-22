import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          position: "absolute",
          backgroundColor: "#171717",
          borderWidth: 1,
          borderColor: "#262626",
          height: 72,
          marginHorizontal: 16,
          marginBottom: 20,
          borderRadius: 24,
        },

        tabBarItemStyle: {
          paddingVertical: 5,
        },

        tabBarActiveTintColor: "#6366f1",
        tabBarInactiveTintColor: "#525252",

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          marginTop: 1,
        },
        
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chat" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="vault"
        options={{
          title: "Vault",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="safe" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
