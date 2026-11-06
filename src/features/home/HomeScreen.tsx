import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { theme } from "@/shared/theme";

/** Pantalla "Inicio": bienvenida y acceso al editor. */
export function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        backgroundColor: theme.background,
      }}
    >
      <Text style={{ fontSize: 26, fontWeight: "700", color: theme.text }}>
        Diseña tu polo
      </Text>
      <Text
        style={{ marginTop: 8, textAlign: "center", color: theme.textMuted }}
      >
        Elige la tela, el color y ajusta las medidas viendo el resultado en 3D.
      </Text>
      <Link href="/design" asChild>
        <Pressable
          style={{
            marginTop: 24,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 24,
            backgroundColor: theme.text,
          }}
        >
          <Text style={{ color: theme.background, fontWeight: "600" }}>
            Empezar a diseñar
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}
