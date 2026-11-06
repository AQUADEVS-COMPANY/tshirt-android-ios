import { MAX_BY_KEY, MIN_MEASURE_CM } from "../constants";
import type { MeasurementKey, Measurements, NumMeasurements } from "../types";

/** Solo números positivos (sin letras ni negativos) y dentro del rango de la parte. */
export function isValidMeasure(text: string, key: MeasurementKey) {
  if (!/^\d+(\.\d+)?$/.test(text)) return false;
  const n = parseFloat(text);
  return n >= MIN_MEASURE_CM && n <= MAX_BY_KEY[key];
}

/** Quita letras, signos y puntos repetidos mientras se escribe. */
export function sanitizeNumber(text: string) {
  const clean = text.replace(/[^0-9.]/g, "");
  const i = clean.indexOf(".");
  return i === -1
    ? clean
    : clean.slice(0, i + 1) + clean.slice(i + 1).replace(/\./g, "");
}

export function measurementsToText(d: NumMeasurements): Measurements {
  return {
    neck: String(d.neck),
    shoulders: String(d.shoulders),
    chest: String(d.chest),
    sleeve: String(d.sleeve),
    length: String(d.length),
  };
}
