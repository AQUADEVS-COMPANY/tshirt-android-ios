export type MeasurementKey =
  "neck" | "shoulders" | "chest" | "sleeve" | "length";

/** Medidas en cm como números (lo que se aplica al modelo). */
export type NumMeasurements = Record<MeasurementKey, number>;

/** Medidas como texto (lo que se escribe en las cajas). */
export type Measurements = Record<MeasurementKey, string>;

export type FabricDesign =
  "plain" | "stripes-h" | "stripes-v" | "checks" | "dots";

export type Fabric = { design: FabricDesign; color: string };

/** Giro y zoom del polo. Vive en un ref para no re-renderizar en cada gesto. */
export type OrbitControl = { rotY: number; rotX: number; zoom: number };

/** Medidas válidas a aplicar al modelo; `version` avisa al Canvas que hay cambios. */
export type MeasureTarget = { values: NumMeasurements | null; version: number };
