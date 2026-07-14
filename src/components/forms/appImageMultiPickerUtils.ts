import type { CSSProperties } from "react";

export function appendImages(
  images: string[],
  pickedImages: string[],
  maxCount: number,
) {
  return images.concat(pickedImages).slice(0, maxCount);
}

export function getGridStyle(tileMinWidth: number): CSSProperties {
  return {
    gridTemplateColumns: `repeat(auto-fit, minmax(${tileMinWidth}px, 1fr))`,
  };
}

export function getLabelText(label: string, optional?: boolean) {
  if (!optional) return label;

  return `${label} (không bắt buộc)`;
}

export function waitForSheetDismiss() {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 180);
  });
}
