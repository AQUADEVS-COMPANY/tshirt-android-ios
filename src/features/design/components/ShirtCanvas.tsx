import { MutableRefObject, Suspense, useRef } from "react";
import { ActivityIndicator, Platform, Text, View } from "react-native";
import { Canvas } from "@react-three/fiber/native";

import { theme } from "@/shared/theme";

import { useCanvasLifecycle } from "../hooks/useCanvasLifecycle";
import { useOrbitGestures } from "../hooks/useOrbitGestures";
import type { Fabric, MeasureTarget, NumMeasurements } from "../types";
import { ShirtModel } from "./ShirtModel";

type Props = {
  uri: string;
  fabric: Fabric;
  shine: boolean;
  target: MutableRefObject<MeasureTarget>;
  onDefaults: (d: NumMeasurements) => void;
};

/** Escena 3D: luces, Canvas, gestos y pantalla de carga. */
export function ShirtCanvas({ uri, fabric, shine, target, onDefaults }: Props) {
  // `invalidate` del Canvas: con frameloop="demand" solo se dibuja cuando se pide
  const invalidateRef = useRef<(() => void) | null>(null);
  const { control, panHandlers } = useOrbitGestures(() =>
    invalidateRef.current?.(),
  );
  const { showCanvas, modelReady, onReady } = useCanvasLifecycle(uri);

  return (
    <View style={{ flex: 1, backgroundColor: theme.canvas }} {...panHandlers}>
      {showCanvas && (
        <Canvas
          camera={{ position: [0, 0, 3] }}
          pointerEvents="none"
          frameloop="demand"
          gl={{ antialias: Platform.OS !== "ios" }}
          onCreated={(state) => {
            invalidateRef.current = state.invalidate;
          }}
        >
          <hemisphereLight args={["#ffffff", "#555566", 0.9]} />
          <directionalLight position={[2, 3, 3]} intensity={1.2} />
          <directionalLight position={[-3, 1, -2]} intensity={0.7} />
          {/* Luz frontal fija (no gira con el polo) para ver el brillo de la tela */}
          {shine && <directionalLight position={[0, 1, 4]} intensity={2} />}
          <Suspense fallback={null}>
            <ShirtModel
              uri={uri}
              fabric={fabric}
              shine={shine}
              control={control}
              target={target}
              onReady={onReady}
              onDefaults={onDefaults}
            />
          </Suspense>
        </Canvas>
      )}
      {!modelReady && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.canvas,
          }}
        >
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 12, color: theme.textMuted }}>
            Cargando modelo 3D…
          </Text>
        </View>
      )}
    </View>
  );
}
