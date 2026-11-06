import { Pressable, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { theme } from "@/shared/theme";

type Props = {
  onDigit: (d: string) => void;
  onDot: () => void;
  onBackspace: () => void;
  onDone: () => void;
};

const ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
] as const;

const SPRING = { damping: 18, stiffness: 260, mass: 0.6 };

/** Sombra suave compartida (iOS usa shadow*, Android usa elevation). */
const keyShadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.12,
  shadowRadius: 3,
  elevation: 3,
} as const;

/** Teclado numérico propio: aparece con un fundido corto y cada tecla "se hunde" al pulsarla. */
export function NumericKeypad({
  onDigit,
  onDot,
  onBackspace,
  onDone,
}: Props) {
  return (
    <Animated.View
      entering={FadeInDown.duration(160)}
      exiting={FadeOut.duration(100)}
      style={{
        gap: 6,
        marginTop: 8,
        padding: 8,
        borderRadius: 14,
        backgroundColor: theme.canvas,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 6,
      }}
    >
      {ROWS.map((row) => (
        <View key={row[0]} style={{ flexDirection: "row", gap: 8 }}>
          {row.map((d) => (
            <Key key={d} label={d} onPress={() => onDigit(d)} />
          ))}
        </View>
      ))}
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Key label="." onPress={onDot} />
        <Key label="0" onPress={() => onDigit("0")} />
        <Key label="⌫" onPress={onBackspace} />
      </View>
      {/* "Listo" a todo el ancho, debajo de la última fila */}
      <View style={{ flexDirection: "row" }}>
        <Key label="Listo" onPress={onDone} primary />
      </View>
    </Animated.View>
  );
}

function Key({
  label,
  onPress,
  primary = false,
}: {
  label: string;
  onPress: () => void;
  primary?: boolean;
}) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[{ flex: 1 }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.set(withSpring(0.92, SPRING));
        }}
        onPressOut={() => {
          scale.set(withSpring(1, SPRING));
        }}
        accessibilityRole="button"
        accessibilityLabel={label === "⌫" ? "Borrar" : label}
        android_ripple={{ color: "#0001", borderless: false }}
        style={({ pressed }) => ({
          alignItems: "center",
          paddingVertical: 7,
          borderRadius: 8,
          backgroundColor: primary
            ? theme.accent
            : pressed
              ? theme.border
              : theme.background,
          ...keyShadow,
        })}
      >
        <Text
          style={{
            fontSize: primary ? 14 : 17,
            fontWeight: primary ? "700" : "600",
            color: theme.text,
          }}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
