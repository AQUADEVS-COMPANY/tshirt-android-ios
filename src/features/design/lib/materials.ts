import * as THREE from "three";

import type { Fabric } from "../types";
import { patternTexture, weaveTexture } from "./fabric-textures";

function forEachMaterial(
  scene: THREE.Object3D,
  fn: (m: THREE.MeshStandardMaterial) => void,
) {
  scene.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mats.forEach((m) => fn(m as THREE.MeshStandardMaterial));
  });
}

/** Ajustes base: no desaparece por recorte y la tela se ve por ambos lados. */
export function prepareScene(scene: THREE.Object3D) {
  scene.traverse((o) => {
    o.frustumCulled = false;
  });
  forEachMaterial(scene, (m) => {
    m.side = THREE.DoubleSide;
    m.needsUpdate = true;
  });
}

/** Diseño (estampado) y color de la tela, con relieve de tejido. */
export function applyFabric(scene: THREE.Object3D, fabric: Fabric) {
  const map = patternTexture(fabric.design);
  forEachMaterial(scene, (m) => {
    m.color?.set(fabric.color);
    m.map = map;
    m.bumpMap = weaveTexture();
    m.bumpScale = 1.5;
    m.emissive?.set("#000000");
    m.emissiveMap = null;
    m.needsUpdate = true;
  });
}

/** Luz frontal activada: la tela se vuelve más brillante (menos rugosa). */
export function applyShine(scene: THREE.Object3D, shine: boolean) {
  forEachMaterial(scene, (m) => {
    m.roughness = shine ? 0.45 : 0.9;
    m.metalness = shine ? 0.15 : 0;
  });
}
