import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAssets } from "expo-asset";

import { FabricPanel } from "./components/FabricPanel";
import { LightToggle } from "./components/LightToggle";
import { MeasurementsPanel } from "./components/MeasurementsPanel";
import { ShirtCanvas } from "./components/ShirtCanvas";
import { DEFAULT_FABRIC, SHIRT_MODEL } from "./constants";
import { useMeasurements } from "./hooks/useMeasurements";
import type { Fabric } from "./types";

/** Pantalla "Diseño": polo 3D + editor de tela y medidas. */
export function DesignScreen() {
  const [assets] = useAssets([SHIRT_MODEL]);
  const uri = assets?.[0]?.localUri ?? assets?.[0]?.uri;

  const [fabric, setFabric] = useState<Fabric>(DEFAULT_FABRIC);
  const [shine, setShine] = useState(false);
  const { measures, defaults, target, onDefaults, onChange } =
    useMeasurements();

  if (!uri) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ShirtCanvas
        uri={uri}
        fabric={fabric}
        shine={shine}
        target={target}
        onDefaults={onDefaults}
      />
      <LightToggle on={shine} onToggle={() => setShine((s) => !s)} />
      <FabricPanel value={fabric} onChange={setFabric} />
      <MeasurementsPanel
        values={measures}
        ready={defaults !== null}
        onChange={onChange}
      />
    </View>
  );
}
