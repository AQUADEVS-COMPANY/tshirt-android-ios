import { useCallback, useRef, useState } from "react";

import { EMPTY_MEASUREMENTS } from "../constants";
import { isValidMeasure, measurementsToText } from "../lib/measurements";
import type {
  MeasureTarget,
  MeasurementKey,
  Measurements,
  NumMeasurements,
} from "../types";

/**
 * Estado de las medidas:
 * - `measures`: texto de las cajas (puede ser inválido mientras se escribe).
 * - `defaults`: medidas originales del modelo (null hasta que carga).
 * - `target`: ref con las medidas VÁLIDAS que el Canvas aplica al modelo.
 */
export function useMeasurements() {
  const [measures, setMeasures] = useState<Measurements>(EMPTY_MEASUREMENTS);
  const [defaults, setDefaults] = useState<NumMeasurements | null>(null);
  const target = useRef<MeasureTarget>({ values: null, version: 0 });

  /** El modelo informa sus medidas por defecto al cargar (solo la primera vez). */
  const onDefaults = useCallback((d: NumMeasurements) => {
    if (target.current.values) return; // ya cargadas (p. ej. al volver a la pantalla)
    target.current = { values: d, version: 0 };
    setDefaults(d);
    setMeasures(measurementsToText(d));
  }, []);

  const onChange = useCallback((key: MeasurementKey, text: string) => {
    setMeasures((m) => ({ ...m, [key]: text }));
    const cur = target.current.values;
    if (cur && isValidMeasure(text, key)) {
      target.current = {
        values: { ...cur, [key]: parseFloat(text) },
        version: target.current.version + 1,
      };
    }
  }, []);

  return { measures, defaults, target, onDefaults, onChange };
}
