import { Pressable, Text } from "react-native";

import { theme } from "@/shared/theme";

type Props = { on: boolean; onToggle: () => void };

/** Botón flotante para encender/apagar la luz frontal (ver el brillo de la tela). */
export function LightToggle({ on, onToggle }: Props) {
  return (
    <Pressable
      onPress={onToggle}
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: on ? theme.accent : "#ffffffcc",
        borderWidth: 1,
        borderColor: theme.borderStrong,
      }}
    >
      <Text style={{ color: theme.text, fontWeight: "600" }}>
        {on ? "💡 Luz frontal: ON" : "💡 Luz frontal: OFF"}
      </Text>
    </Pressable>
  );
}
