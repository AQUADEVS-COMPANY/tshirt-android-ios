import { MutableRefObject, useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber/native";
import { useGLTF } from "@react-three/drei/native";
import * as THREE from "three";

import { applyFabric, applyShine, prepareScene } from "../lib/materials";
import {
  analyzeShirt,
  applyMeasures,
  type ShirtInfo,
} from "../lib/shirt-geometry";
import type {
  Fabric,
  MeasureTarget,
  NumMeasurements,
  OrbitControl,
} from "../types";

type Props = {
  uri: string;
  fabric: Fabric;
  shine: boolean;
  control: MutableRefObject<OrbitControl>;
  target: MutableRefObject<MeasureTarget>;
  onReady: () => void;
  onDefaults: (d: NumMeasurements) => void;
};

/** El polo 3D: carga el .glb, aplica tela/medidas y se mueve según los gestos. */
export function ShirtModel({
  uri,
  fabric,
  shine,
  control,
  target,
  onReady,
  onDefaults,
}: Props) {
  const group = useRef<THREE.Group>(null);
  const appliedVersion = useRef(-1);
  const frames = useRef(0);
  const { scene } = useGLTF(uri);

  // Geometría original + medidas por defecto. Se guardan en el scene para no recalcular
  // sobre una geometría ya deformada.
  const info = useMemo(() => {
    scene.userData.shirtInfo ??= analyzeShirt(scene);
    return scene.userData.shirtInfo as ShirtInfo;
  }, [scene]);

  useEffect(() => onDefaults(info.defaults), [info, onDefaults]);
  useEffect(() => prepareScene(scene), [scene]);
  useEffect(() => applyFabric(scene, fabric), [scene, fabric]);
  useEffect(() => applyShine(scene, shine), [scene, shine]);

  // Centra el modelo y lo escala para que siempre quepa en pantalla
  const { scale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const max = Math.max(size.x, size.y, size.z) || 1;
    return { scale: 2 / max, offset: center.multiplyScalar(-1) };
  }, [scene]);

  useFrame(() => {
    const t = target.current;
    if (t.values && appliedVersion.current !== t.version) {
      applyMeasures(info, t.values);
      appliedVersion.current = t.version;
    }
    const g = group.current;
    if (!g) return;
    g.rotation.y = control.current.rotY;
    g.rotation.x = control.current.rotX;
    g.scale.setScalar(scale * control.current.zoom);
    // Avisa que ya se dibujó (tras unos frames) para quitar el loading
    if (frames.current < 3 && ++frames.current === 3) onReady();
  });

  return (
    <group ref={group} scale={scale}>
      <primitive object={scene} position={offset} />
    </group>
  );
}
