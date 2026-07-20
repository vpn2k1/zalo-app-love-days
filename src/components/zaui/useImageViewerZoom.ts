import { useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import {
  clampImagePosition,
  clampImageScale,
  getPointerDistance,
  MIN_IMAGE_SCALE,
  type ImagePosition,
} from "@/components/zaui/imageViewerZoom";

const ZOOMED_SCALE = 2.4;
const DRAG_THRESHOLD = 4;

export function useImageViewerZoom() {
  const [scale, setScale] = useState(MIN_IMAGE_SCALE);
  const [position, setPosition] = useState<ImagePosition>({ x: 0, y: 0 });
  const pointersRef = useRef(new Map<number, PointerEvent>());
  const pinchStartRef = useRef({ distance: 0, scale: MIN_IMAGE_SCALE });
  const dragStartRef = useRef({ pointerId: -1, clientX: 0, clientY: 0 });
  const positionRef = useRef(position);
  const scaleRef = useRef(scale);
  const draggedRef = useRef(false);
  const pinchedRef = useRef(false);

  const updatePosition = (nextPosition: ImagePosition) => {
    positionRef.current = nextPosition;
    setPosition(nextPosition);
  };

  const updateScale = (nextScale: number) => {
    scaleRef.current = nextScale;
    setScale(nextScale);
  };

  const resetZoom = () => {
    updateScale(MIN_IMAGE_SCALE);
    updatePosition({ x: 0, y: 0 });
    pointersRef.current.clear();
    pinchStartRef.current = { distance: 0, scale: MIN_IMAGE_SCALE };
    dragStartRef.current = { pointerId: -1, clientX: 0, clientY: 0 };
    draggedRef.current = false;
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
    if (draggedRef.current || pinchedRef.current) {
      draggedRef.current = false;
      pinchedRef.current = false;
      return;
    }

    if (scaleRef.current > MIN_IMAGE_SCALE) {
      updateScale(MIN_IMAGE_SCALE);
      updatePosition({ x: 0, y: 0 });
      return;
    }

    updateScale(ZOOMED_SCALE);
  };

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    if (pointersRef.current.size === 0) {
      draggedRef.current = false;
      pinchedRef.current = false;
    }

    pointersRef.current.set(event.pointerId, event.nativeEvent);
    if (pointersRef.current.size >= 2) {
      pinchedRef.current = true;
      updatePinchStart(scaleRef.current);
      return;
    }

    dragStartRef.current = {
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
    };
  };

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (!pointersRef.current.has(event.pointerId)) return;

    pointersRef.current.set(event.pointerId, event.nativeEvent);
    if (pointersRef.current.size < 2) {
      handleDrag(event);
      return;
    }

    event.preventDefault();
    pinchedRef.current = true;
    const distance = getPointerDistance(pointersRef.current);
    if (pinchStartRef.current.distance <= 0) {
      updatePinchStart(scaleRef.current);
      return;
    }

    const nextScale =
      (distance / pinchStartRef.current.distance) * pinchStartRef.current.scale;
    const clampedScale = clampImageScale(nextScale);
    updateScale(clampedScale);
    updatePosition(
      clampImagePosition(positionRef.current, clampedScale, event.currentTarget),
    );
  };

  const handleDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (scaleRef.current <= MIN_IMAGE_SCALE) return;
    if (dragStartRef.current.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - dragStartRef.current.clientX;
    const deltaY = event.clientY - dragStartRef.current.clientY;
    if (!draggedRef.current && Math.hypot(deltaX, deltaY) < DRAG_THRESHOLD) {
      return;
    }

    event.preventDefault();
    draggedRef.current = true;
    updatePosition(
      clampImagePosition(
        { x: positionRef.current.x + deltaX, y: positionRef.current.y + deltaY },
        scaleRef.current,
        event.currentTarget,
      ),
    );
    dragStartRef.current = {
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
    };
  };

  const handlePointerEnd = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    pointersRef.current.delete(event.pointerId);
    updatePinchStart(scaleRef.current);

    const remainingPointer = pointersRef.current.values().next().value;
    if (!remainingPointer) return;

    dragStartRef.current = {
      pointerId: remainingPointer.pointerId,
      clientX: remainingPointer.clientX,
      clientY: remainingPointer.clientY,
    };
  };

  return {
    handlePointerDown,
    handlePointerEnd,
    handlePointerMove,
    position,
    resetZoom,
    scale,
    toggleZoom,
  };
}
