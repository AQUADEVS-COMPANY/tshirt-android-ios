import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { theme } from "@/shared/theme";

import { MAX_BY_KEY, MEASURE_FIELDS } from "../constants";
import { isValidMeasure, sanitizeNumber } from "../lib/measurements";
import type { MeasurementKey, Measurements } from "../types";
import { NumericKeypad } from "./NumericKeypad";

const MAX_CHARS = 5;

type Props = {
  values: Measurements;
  /** null mientras el modelo no ha cargado (las cajas quedan deshabilitadas). */
  ready: boolean;
  onChange: (key: MeasurementKey, value: string) => void;
};

/** Cajas para editar las medidas (cm) del polo con teclado numérico propio. */
export function MeasurementsPanel({ values, ready, onChange }: Props) {
  const [active, setActive] = useState<MeasurementKey | null>(null);
  // true justo tras seleccionar: el primer dígito reemplaza el valor actual
  const [fresh, setFresh] = useState(false);

  const select = (key: MeasurementKey) => {
    setActive(key);
    setFresh(true);
  };

  const append = (ch: string) => {
    if (!active) return;
    const base = fresh ? "" : values[active];
    if (base.length >= MAX_CHARS) return;
    onChange(active, sanitizeNumber(base + ch));
    setFresh(false);
  };

  const backspace = () => {
    if (!active) return;
    onChange(active, fresh ? "" : values[active].slice(0, -1));
    setFresh(false);
  };

  return (
    <View
      style={{
        backgroundColor: theme.background,
        padding: 12,
        borderTopWidth: 1,
        borderColor: theme.border,
      }}
    >
      <Text style={{ fontWeight: "600", marginBottom: 8, color: theme.text }}>
        Medidas (cm)
      </Text>
      <ScrollView
        horizontal
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
      >
        {MEASURE_FIELDS.map((f) => {
          const invalid = ready && !isValidMeasure(values[f.key], f.key);
          const isActive = active === f.key;
          return (
            <View key={f.key} style={{ marginRight: 10, width: 96 }}>
              <Text
                style={{
                  fontSize: 12,
                  color: theme.textMuted,
                  marginBottom: 4,
                }}
              >
                {f.label}
              </Text>
              <Pressable
                disabled={!ready}
                onPress={() => select(f.key)}
                accessibilityRole="button"
                accessibilityLabel={`${f.label}: ${values[f.key] || "vacío"}`}
                style={{
                  borderWidth: isActive ? 2 : 1,
                  borderColor: invalid
                    ? theme.danger
                    : isActive
                      ? theme.selected
                      : theme.borderStrong,
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  minHeight: 34,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: values[f.key] ? theme.text : theme.textFaint,
                  }}
                >
                  {values[f.key] || "…"}
                </Text>
              </Pressable>
              {ready && (
                <Text
                  style={{
                    fontSize: 10,
                    marginTop: 2,
                    color: invalid ? theme.danger : theme.textFaint,
                  }}
                >
                  máx. {MAX_BY_KEY[f.key]} cm
                </Text>
              )}
            </View>
          );
        })}
      </ScrollView>
      {active && (
        <NumericKeypad
          onDigit={append}
          onDot={() => append(".")}
          onBackspace={backspace}
          onDone={() => setActive(null)}
        />
      )}
    </View>
  );
}
