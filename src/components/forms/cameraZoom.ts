export type CameraZoomRange = {
  max: number;
  min: number;
  step: number;
};

export const CAMERA_DEFAULT_ZOOM = 1;
export const CAMERA_ZOOM_RANGE: CameraZoomRange = { max: 2, min: 1, step: 0.1 };

export function clampCameraZoom(value: number, range: CameraZoomRange) {
  if (value < range.min) return range.min;
  if (value > range.max) return range.max;

  return value;
}

export async function cropImageDataToZoom(imageData: string, zoom: number) {
  if (zoom <= 1) return imageData;

  const image = await loadImage(imageData);
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const width = image.naturalWidth / zoom;
  const height = image.naturalHeight / zoom;
  const x = (image.naturalWidth - width) / 2;
  const y = (image.naturalHeight - height) / 2;
  const context = canvas.getContext("2d");
  if (!context) return imageData;

  context.drawImage(
    image,
    x,
    y,
    width,
    height,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return canvas.toDataURL("image/jpeg", 0.96);
}

function loadImage(imageData: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = imageData;
  });
}
