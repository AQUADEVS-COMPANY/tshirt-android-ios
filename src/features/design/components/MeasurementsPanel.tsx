import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { theme } from "@/shared/theme";

import { MAX_BY_KEY, MEASURE_FIELDS } from "../constants";
import { isValidMeasure, sanitizeNumber } from "../lib/measurements";
import type { MeasurementKey, Measurements } from "../types";

type Props = {
  values: Measurements;
  /** null mientras el modelo no ha cargado (las cajas quedan deshabilitadas). */
  ready: boolean;
  onChange: (key: MeasurementKey, value: string) => void;
};

/** Cajas para editar las medidas (cm) del polo. */
export function MeasurementsPanel({ values, ready, onChange }: Props) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
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
                <TextInput
                  value={values[f.key]}
                  editable={ready}
                  onChangeText={(t) => onChange(f.key, sanitizeNumber(t))}
                  keyboardType="decimal-pad"
                  placeholder="…"
                  maxLength={5}
                  style={{
                    borderWidth: 1,
                    borderColor: invalid ? theme.danger : theme.borderStrong,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    color: theme.text,
                  }}
                />
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
      </View>
    </KeyboardAvoidingView>
  );
}
