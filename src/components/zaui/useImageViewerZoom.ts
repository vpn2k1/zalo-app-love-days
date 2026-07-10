import { useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const ZOOMED_SCALE = 2.4;

export function useImageViewerZoom() {
  const [scale, setScale] = useState(MIN_SCALE);
  const pointersRef = useRef(new Map<number, PointerEvent>());
  const pinchStartRef = useRef({ distance: 0, scale: MIN_SCALE });
  const pinchedRef = useRef(false);

  const resetZoom = () => {
    setScale(MIN_SCALE);
    pointersRef.current.clear();
    pinchStartRef.current = { distance: 0, scale: MIN_SCALE };
    pinchedRef.current = false;
  };

  const updatePinchStart = (nextScale: number) => {
    if (pointersRef.current.size < 2) {
      pinchStartRef.current = { distance: 0, scale: nextScale };
      return;
    }

    pinchStartRef.current = {
      distance: getPointerDistance(pointersRef.current),
      scale: nextScale,
    };
  };

  const toggleZoom = () => {
    if (pinchedRef.current) {
      pinchedRef.current = false;
      return;
    }

    setScale((value) => {
      if (value > MIN_SCALE) return MIN_SCALE;

      return ZOOMED_SCALE;
    });
  };

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointersRef.current.set(event.pointerId, event.nativeEvent);
    updatePinchStart(scale);
  };

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    pointersRef.current.set(event.pointerId, event.nativeEvent);
    if (pointersRef.current.size < 2) return;

    event.preventDefault();
    pinchedRef.current = true;
    const distance = getPointerDistance(pointersRef.current);
    if (pinchStartRef.current.distance <= 0) {
      updatePinchStart(scale);
      return;
    }

    const nextScale =
      (distance / pinchStartRef.current.distance) * pinchStartRef.current.scale;
    setScale(clampScale(nextScale));
  };

  const handlePointerEnd = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    pointersRef.current.delete(event.pointerId);
    updatePinchStart(scale);
  };

  return {
    handlePointerDown,
    handlePointerEnd,
    handlePointerMove,
    resetZoom,
    scale,
    toggleZoom,
  };
}

function getPointerDistance(pointers: Map<number, PointerEvent>) {
  const values = Array.from(pointers.values());
  const first = values[0];
  const second = values[1];
  if (!first) return 0;
  if (!second) return 0;

  return Math.hypot(
    first.clientX - second.clientX,
    first.clientY - second.clientY,
  );
}

function clampScale(value: number) {
  if (value < MIN_SCALE) return MIN_SCALE;
  if (value > MAX_SCALE) return MAX_SCALE;

  return value;
}
