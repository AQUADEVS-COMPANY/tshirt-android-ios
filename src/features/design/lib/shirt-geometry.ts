import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

import { ASSUMED_LENGTH_CM } from "../constants";
import type { NumMeasurements } from "../types";

/** Datos de la malla original y sus medidas por defecto. */
export type ShirtInfo = {
  attr: THREE.BufferAttribute;
  orig: Float32Array; // posiciones originales (x,y,z)
  cx: number;
  cz: number;
  y0: number;
  h: number;
  bodyHalf: number; // semiancho máximo del torso (sin mangas)
  neckHalf: number; // semiancho del cuello
  defaults: NumMeasurements;
};

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const round1 = (n: number) => Math.round(n * 10) / 10;

/** Prepara la malla del polo y calcula sus medidas por defecto. */
export function analyzeShirt(scene: THREE.Object3D): ShirtInfo {
  const parts: THREE.Mesh[] = [];
  scene.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) parts.push(o as THREE.Mesh);
  });
  if (parts.length === 0) throw new Error("The model has no meshes");

  // Una sola malla: si el modelo trae varias piezas se juntan, para que no queden
  // grietas entre piezas que se deformen distinto.
  const main = parts[0];
  if (parts.length > 1) {
    const pieces = parts.map((m) => {
      const g = m.geometry.clone();
      for (const name of Object.keys(g.attributes)) {
        if (name !== "position") g.deleteAttribute(name);
      }
      return g;
    });
    const joined = mergeGeometries(pieces, false);
    pieces.forEach((g) => g.dispose());
    joined.computeVertexNormals();
    main.geometry.dispose();
    main.geometry = joined;
    if (Array.isArray(main.material)) main.material = main.material[0];
    parts.slice(1).forEach((p) => p.removeFromParent());
  }
  const geometry = main.geometry;

  // Los .glb optimizados suelen traer posición+normal intercaladas en un mismo buffer
  // (InterleavedBufferAttribute). Se copia la posición a un buffer propio y plano (x,y,z).
  const rawPos = geometry.getAttribute("position");
  if (
    (rawPos as THREE.InterleavedBufferAttribute).isInterleavedBufferAttribute
  ) {
    const flat = new Float32Array(rawPos.count * 3);
    for (let i = 0; i < rawPos.count; i++) {
      flat[i * 3] = rawPos.getX(i);
      flat[i * 3 + 1] = rawPos.getY(i);
      flat[i * 3 + 2] = rawPos.getZ(i);
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(flat, 3));
  }
  const attr = geometry.getAttribute("position") as THREE.BufferAttribute;
  const orig = new Float32Array(attr.array as ArrayLike<number>);

  // Dimensiones en las coordenadas crudas de la geometría (sin la escala del nodo)
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity,
    minZ = Infinity,
    maxZ = -Infinity;
  for (let i = 0; i < orig.length; i += 3) {
    minX = Math.min(minX, orig[i]);
    maxX = Math.max(maxX, orig[i]);
    minY = Math.min(minY, orig[i + 1]);
    maxY = Math.max(maxY, orig[i + 1]);
    minZ = Math.min(minZ, orig[i + 2]);
    maxZ = Math.max(maxZ, orig[i + 2]);
  }
  const cx = (minX + maxX) / 2;
  const cz = (minZ + maxZ) / 2;
  const y0 = minY;
  const h = maxY - minY;

  // UVs por proyección frontal (x, y) si el modelo no trae los suyos (para los estampados)
  if (!geometry.getAttribute("uv")) {
    const uv = new Float32Array(attr.count * 2);
    for (let i = 0; i < attr.count; i++) {
      uv[i * 2] = (orig[i * 3] - cx) / h;
      uv[i * 2 + 1] = (orig[i * 3 + 1] - y0) / h;
    }
    geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  }

  let bodyHalf = 0,
    shoulderHalf = 0,
    neckHalf = 0,
    allHalf = 0;
  let neckMinZ = Infinity,
    neckMaxZ = -Infinity;
  for (let i = 0; i < orig.length; i += 3) {
    const dx = Math.abs(orig[i] - cx);
    const t = (orig[i + 1] - y0) / h;
    allHalf = Math.max(allHalf, dx);
    if (t < 0.45) bodyHalf = Math.max(bodyHalf, dx);
    if (t > 0.78 && t < 0.9) shoulderHalf = Math.max(shoulderHalf, dx);
    if (t > 0.95) {
      neckHalf = Math.max(neckHalf, dx);
      neckMinZ = Math.min(neckMinZ, orig[i + 2]);
      neckMaxZ = Math.max(neckMaxZ, orig[i + 2]);
    }
  }

  const unitsPerCm = h / ASSUMED_LENGTH_CM;
  const neckW = neckHalf * 2;
  const neckD = neckMaxZ - neckMinZ;
  const defaults: NumMeasurements = {
    length: ASSUMED_LENGTH_CM,
    chest: round1((bodyHalf * 2 * 2) / unitsPerCm), // circunferencia ≈ 2 × ancho plano
    shoulders: round1((shoulderHalf * 2) / unitsPerCm),
    sleeve: round1((allHalf - bodyHalf) / unitsPerCm),
    neck: round1((Math.PI * (neckW + neckD)) / 2 / unitsPerCm),
  };

  return { attr, orig, cx, cz, y0, h, bodyHalf, neckHalf, defaults };
}

/** Deforma el polo según las medidas (siempre parte de la geometría original). */
export function applyMeasures(info: ShirtInfo, v: NumMeasurements) {
  const d = info.defaults;
  const kLen = v.length / d.length;
  const kChest = v.chest / d.chest;
  const kSleeve = v.sleeve / d.sleeve;
  const kShoulder = v.shoulders / d.shoulders;
  const kNeck = v.neck / d.neck;
  const { attr, orig, cx, cz, y0, h, bodyHalf, neckHalf } = info;
  const yArm = y0 + h * 0.45;
  const out = attr.array as Float32Array;

  for (let i = 0; i < orig.length; i += 3) {
    const dx = orig[i] - cx;
    const y = orig[i + 1];
    const dz = orig[i + 2] - cz;
    const t = (y - y0) / h;
    const adx = Math.abs(dx);

    const wNeck =
      smooth(0.88, 0.96, t) * (1 - smooth(neckHalf, neckHalf * 2.2, adx));
    const wShoulder = smooth(0.6, 0.8, t) * (1 - wNeck);
    const wChest = 1 - smooth(0.45, 0.8, t);
    const wSleeve = 1 - smooth(0.65, 0.82, t);

    const fChest = 1 + (kChest - 1) * wChest;
    const fNeck = 1 + (kNeck - 1) * wNeck;
    const fx = fChest * (1 + (kShoulder - 1) * wShoulder) * fNeck;
    const fz = fChest * fNeck;

    let nx = dx * fx;
    if (adx > bodyHalf)
      nx += Math.sign(dx) * (adx - bodyHalf) * (kSleeve - 1) * wSleeve;

    out[i] = cx + nx;
    out[i + 1] = y < yArm ? yArm - (yArm - y) * kLen : y;
    out[i + 2] = cz + dz * fz;
  }
  attr.needsUpdate = true;
}
