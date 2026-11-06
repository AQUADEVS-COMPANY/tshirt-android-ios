import type {
  Fabric,
  FabricDesign,
  MeasurementKey,
  Measurements,
} from "./types";

/** Modelo 3D del polo (optimizado, ver ARCHITECTURE.md). */
// eslint-disable-next-line @typescript-eslint/no-require-imports
export const SHIRT_MODEL = require("../../../assets/models/tshirt.glb");

/** El .glb no trae escala real: se ASUME que el polo mide esto de largo. */
export const ASSUMED_LENGTH_CM = 70;

export const ZOOM = { min: 0.5, max: 4 } as const;

// --- Medidas ---------------------------------------------------------------

export const MEASURE_FIELDS: { key: MeasurementKey; label: string }[] = [
  { key: "neck", label: "Cuello" },
  { key: "shoulders", label: "Hombros" },
  { key: "chest", label: "Pecho" },
  { key: "sleeve", label: "Manga" },
  { key: "length", label: "Largo" },
];

export const EMPTY_MEASUREMENTS: Measurements = {
  neck: "",
  shoulders: "",
  chest: "",
  sleeve: "",
  length: "",
};

/** Tamaño mínimo (cm) permitido para cualquier parte. */
export const MIN_MEASURE_CM = 1;

/** Tamaño máximo (cm) permitido para cada parte del polo. */
export const MAX_BY_KEY: Record<MeasurementKey, number> = {
  neck: 80,
  shoulders: 80,
  chest: 160,
  sleeve: 45,
  length: 110,
};

// --- Tela ------------------------------------------------------------------

export const FABRIC_DESIGNS: { key: FabricDesign; label: string }[] = [
  { key: "plain", label: "Liso" },
  { key: "stripes-h", label: "Rayas ═" },
  { key: "stripes-v", label: "Rayas ║" },
  { key: "checks", label: "Cuadros" },
  { key: "dots", label: "Puntos" },
];

export const FABRIC_COLORS: { name: string; hex: string }[] = [
  { name: "Negro", hex: "#0d0d0d" },
  { name: "Blanco", hex: "#f2f2f2" },
  { name: "Gris", hex: "#8a8a8a" },
  { name: "Azul marino", hex: "#1b2a4a" },
  { name: "Rojo", hex: "#b3202a" },
  { name: "Verde", hex: "#1f6b3a" },
  { name: "Amarillo", hex: "#e0b72a" },
];

export const DEFAULT_FABRIC: Fabric = {
  design: "plain",
  color: FABRIC_COLORS[0].hex,
};
