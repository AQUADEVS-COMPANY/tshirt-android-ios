import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { theme } from "@/shared/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        // Navegación superior: encabezado con el título de cada pantalla
        headerStyle: { backgroundColor: theme.background },
        headerTitleStyle: { fontWeight: "700" },
        headerTitleAlign: "center",
        // Navegación inferior
        tabBarActiveTintColor: theme.text,
        tabBarInactiveTintColor: theme.tabInactive,
        tabBarStyle: { backgroundColor: theme.background },      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color as string} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="design"
        options={{
          title: "Diseño",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="shirt-outline"
              color={color as string}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
