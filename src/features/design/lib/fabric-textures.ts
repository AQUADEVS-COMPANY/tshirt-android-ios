import * as THREE from "three";

import type { FabricDesign } from "../types";

const SIZE = 128;
const DARK = 90; // el patrón oscuro multiplica el color base (queda un tono más oscuro)
const cache = new Map<FabricDesign, THREE.DataTexture>();

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

function finish(tex: THREE.DataTexture, repeat: number) {
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter; // sin dientes de sierra a distancia
  tex.generateMipmaps = true;
  tex.repeat.set(repeat, repeat);
  tex.needsUpdate = true;
  return tex;
}

/** Textura procedural (blanco + tono oscuro, bordes suaves) que se tiñe con el color elegido. */
export function patternTexture(design: FabricDesign): THREE.DataTexture | null {
  if (design === "plain") return null;
  const hit = cache.get(design);
  if (hit) return hit;

  const half = SIZE / 2;
  // cobertura (0..1) de una franja [0, half) con borde suavizado de 1 px
  const band = (p: number) =>
    p < half ? clamp01(p + 0.5) * clamp01(half - p - 0.5) : 0;
  const data = new Uint8Array(SIZE * SIZE * 4);
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const sh = band(y);
      const sv = band(x);
      let d = 0;
      if (design === "stripes-h") d = sh;
      else if (design === "stripes-v") d = sv;
      else if (design === "checks") d = sh + sv - 2 * sh * sv;
      else if (design === "dots") {
        const dx = (x % half) - half / 2 + 0.5;
        const dy = (y % half) - half / 2 + 0.5;
        d = clamp01(half / 4 - Math.hypot(dx, dy) + 0.5);
      }
      const v = Math.round(255 - (255 - DARK) * d);
      const i = (y * SIZE + x) * 4;
      data[i] = data[i + 1] = data[i + 2] = v;
      data[i + 3] = 255;
    }
  }
  const tex = finish(
    new THREE.DataTexture(data, SIZE, SIZE, THREE.RGBAFormat),
    4,
  );
  cache.set(design, tex);
  return tex;
}

let weave: THREE.DataTexture | null = null;

/** Microrelieve de tejido (hilos) para el bumpMap: da sensación de tela en vez de plástico. */
export function weaveTexture(): THREE.DataTexture {
  if (weave) return weave;
  const S = 32;
  const data = new Uint8Array(S * S * 4);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const v =
        128 +
        110 * Math.cos((2 * Math.PI * x) / 8) * Math.cos((2 * Math.PI * y) / 8);
      const i = (y * S + x) * 4;
      data[i] = data[i + 1] = data[i + 2] = Math.round(v);
      data[i + 3] = 255;
    }
  }
  weave = finish(new THREE.DataTexture(data, S, S, THREE.RGBAFormat), 70);
  return weave;
}
