import { useCallback, useState } from "react";
import { useGLTF } from "@react-three/drei/native";
import { useFocusEffect } from "expo-router";

const MOUNT_DELAY_MS = 250;

/**
 * Android destruye el contexto 3D al cambiar de pestaña. Por eso el Canvas se desmonta al
 * salir de la pantalla y se monta de nuevo (tras una pequeña espera) al volver, y se limpia
 * la caché del modelo para que no quede ligada al contexto anterior.
 */
export function useCanvasLifecycle(uri: string | undefined) {
  const [showCanvas, setShowCanvas] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const onReady = useCallback(() => setModelReady(true), []);

  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => setShowCanvas(true), MOUNT_DELAY_MS);
      return () => {
        clearTimeout(timer);
        setShowCanvas(false);
        setModelReady(false);
        if (uri) useGLTF.clear(uri);
      };
    }, [uri]),
  );

  return { showCanvas, modelReady, onReady };
}
