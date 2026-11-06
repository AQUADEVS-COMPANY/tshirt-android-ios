/* eslint-disable react-hooks/refs -- falso positivo: los refs solo se leen dentro de los handlers de PanResponder */
import { useMemo, useRef } from "react";
import { PanResponder } from "react-native";

import { ZOOM } from "../constants";
import type { OrbitControl } from "../types";

const ROTATE_SPEED = 0.01;

/**
 * Gestos para mover el polo: un dedo gira, dos dedos (pellizco) hacen zoom.
 * El resultado se guarda en `control` (ref) que el Canvas lee en cada frame.
 */
export function useOrbitGestures(onChange?: () => void) {
  // Ref para no recrear el PanResponder cuando cambia el callback
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const control = useRef<OrbitControl>({ rotY: 0, rotX: 0, zoom: 1 });
  const last = useRef({ x: 0, y: 0, dist: 0, touches: 0 });

  const responder = useMemo(() => {
    const reset = () => {
      last.current.touches = 0;
      last.current.dist = 0;
    };
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (e) => {
        const t = e.nativeEvent.touches;
        const l = last.current;
        if (t.length >= 2) {
          const dist = Math.hypot(
            t[0].pageX - t[1].pageX,
            t[0].pageY - t[1].pageY,
          );
          if (l.touches >= 2 && l.dist > 0) {
            const z = control.current.zoom * (dist / l.dist);
            control.current.zoom = Math.min(ZOOM.max, Math.max(ZOOM.min, z));
          }
          l.dist = dist;
        } else if (t.length === 1) {
          const { pageX, pageY } = t[0];
          if (l.touches === 1) {
            control.current.rotY += (pageX - l.x) * ROTATE_SPEED;
            control.current.rotX += (pageY - l.y) * ROTATE_SPEED;
          }
          l.x = pageX;
          l.y = pageY;
          l.dist = 0;
        }
        l.touches = t.length;
        onChangeRef.current?.(); // pide un nuevo frame (frameloop="demand")
      },
      onPanResponderRelease: reset,
      onPanResponderTerminate: reset,
    });
  }, []);

  return { control, panHandlers: responder.panHandlers };
}
