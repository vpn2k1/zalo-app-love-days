export const MIN_IMAGE_SCALE = 1;

const MAX_IMAGE_SCALE = 4;

export type ImagePosition = {
  x: number;
  y: number;
};

export function getPointerDistance(pointers: Map<number, PointerEvent>) {
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

export function clampImageScale(value: number) {
  if (value < MIN_IMAGE_SCALE) return MIN_IMAGE_SCALE;
  if (value > MAX_IMAGE_SCALE) return MAX_IMAGE_SCALE;

  return value;
}

export function clampImagePosition(
  position: ImagePosition,
  scale: number,
  element: HTMLElement,
) {
  if (scale <= MIN_IMAGE_SCALE) return { x: 0, y: 0 };

  const bounds = getPanBounds(element, scale);
  return {
    x: Math.min(bounds.x, Math.max(-bounds.x, position.x)),
    y: Math.min(bounds.y, Math.max(-bounds.y, position.y)),
  };
}

function getPanBounds(element: HTMLElement, scale: number) {
  const { width, height } = element.getBoundingClientRect();
  const image = element.querySelector("img");
  if (!image?.naturalWidth || !image.naturalHeight) {
    const scaleDelta = scale - MIN_IMAGE_SCALE;
    return { x: width * scaleDelta / 2, y: height * scaleDelta / 2 };
  }

  const fittedScale = Math.min(
    width / image.naturalWidth,
    height / image.naturalHeight,
  );
  const imageWidth = image.naturalWidth * fittedScale * scale;
  const imageHeight = image.naturalHeight * fittedScale * scale;

  return {
    x: Math.max(0, (imageWidth - width) / 2),
    y: Math.max(0, (imageHeight - height) / 2),
  };
}
