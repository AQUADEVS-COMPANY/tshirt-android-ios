import { Pressable, ScrollView, Text, View } from "react-native";

import { theme } from "@/shared/theme";

import { FABRIC_COLORS, FABRIC_DESIGNS } from "../constants";
import type { Fabric } from "../types";

type Props = { value: Fabric; onChange: (f: Fabric) => void };

/** Selector de diseño (estampado) y color de la tela. */
export function FabricPanel({ value, onChange }: Props) {
  return (
    <View
      style={{
        backgroundColor: theme.background,
        paddingTop: 10,
        paddingBottom: 4,
        borderTopWidth: 1,
        borderColor: theme.border,
      }}
    >
      <Text
        style={{
          fontWeight: "600",
          marginLeft: 12,
          marginBottom: 6,
          color: theme.text,
        }}
      >
        Tela
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      >
        {FABRIC_DESIGNS.map((d) => {
          const on = d.key === value.design;
          return (
            <Pressable
              key={d.key}
              onPress={() => onChange({ ...value, design: d.key })}
              style={{
                marginRight: 8,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: on ? theme.text : theme.borderStrong,
                backgroundColor: on ? theme.text : theme.background,
              }}
            >
              <Text
                style={{
                  color: on ? theme.background : theme.text,
                  fontSize: 13,
                }}
              >
                {d.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8 }}
      >
        {FABRIC_COLORS.map((c) => {
          const on = c.hex === value.color;
          return (
            <Pressable
              key={c.hex}
              accessibilityLabel={c.name}
              onPress={() => onChange({ ...value, color: c.hex })}
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                marginRight: 10,
                backgroundColor: c.hex,
                borderWidth: on ? 3 : 1,
                borderColor: on ? theme.selected : theme.borderStrong,
              }}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}
