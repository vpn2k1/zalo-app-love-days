import { isFrontCamera, type CameraFacing } from "./cameraCaptureHelpers";

export type CameraZoomRange = {
  max: number;
  min: number;
  step: number;
};

export const CAMERA_DEFAULT_ZOOM = 1;
export const CAMERA_ZOOM_RANGE: CameraZoomRange = { max: 2, min: 1, step: 0.1 };
const CAMERA_FRONT_ZOOM_RANGE: CameraZoomRange = { max: 1, min: 0.5, step: 0.1 };

export function clampCameraZoom(value: number, range: CameraZoomRange) {
  if (value < range.min) return range.min;
  if (value > range.max) return range.max;

  return value;
}

export function getCameraDefaultZoom(facing: CameraFacing) {
  if (isFrontCamera(facing)) return CAMERA_FRONT_ZOOM_RANGE.min;

  return CAMERA_DEFAULT_ZOOM;
}

export function getCameraZoomRange(facing: CameraFacing) {
  if (isFrontCamera(facing)) return CAMERA_FRONT_ZOOM_RANGE;

  return CAMERA_ZOOM_RANGE;
}

export function getCameraZoomScale(facing: CameraFacing, zoom: number) {
  const range = getCameraZoomRange(facing);

  return zoom / range.min;
}

export async function cropImageDataToZoom(imageData: string, zoom: number) {
  if (zoom === 1) return imageData;

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

  if (zoom < 1) {
    drawZoomedOutImage(context, image, zoom);
    return canvas.toDataURL("image/jpeg", 0.96);
  }

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

export function captureVideoFrameToImageData(
  videoElement: HTMLVideoElement | null,
  zoom: number,
  mirrored: boolean,
) {
  if (!videoElement?.videoWidth || !videoElement.videoHeight) return null;

  const canvas = document.createElement("canvas");
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;

  const context = canvas.getContext("2d");
  if (!context) return null;

  drawVideoFrame(context, videoElement, zoom, mirrored);

  return canvas.toDataURL("image/jpeg", 0.96);
}

function drawVideoFrame(
  context: CanvasRenderingContext2D,
  videoElement: HTMLVideoElement,
  zoom: number,
  mirrored: boolean,
) {
  const width = videoElement.videoWidth;
  const height = videoElement.videoHeight;

  context.fillStyle = "#000000";
  context.fillRect(0, 0, width, height);
  context.save();
  if (mirrored) {
    context.translate(width, 0);
    context.scale(-1, 1);
  }

  drawVideoFrameAtZoom(context, videoElement, zoom);
  context.restore();
}

function drawVideoFrameAtZoom(
  context: CanvasRenderingContext2D,
  videoElement: HTMLVideoElement,
  zoom: number,
) {
  if (zoom < 1) {
    const width = videoElement.videoWidth * zoom;
    const height = videoElement.videoHeight * zoom;
    const x = (videoElement.videoWidth - width) / 2;
    const y = (videoElement.videoHeight - height) / 2;
    context.drawImage(videoElement, x, y, width, height);
    return;
  }

  const width = videoElement.videoWidth / zoom;
  const height = videoElement.videoHeight / zoom;
  const x = (videoElement.videoWidth - width) / 2;
  const y = (videoElement.videoHeight - height) / 2;
  context.drawImage(
    videoElement,
    x,
    y,
    width,
    height,
    0,
    0,
    videoElement.videoWidth,
    videoElement.videoHeight,
  );
}

function drawZoomedOutImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  zoom: number,
) {
  const width = image.naturalWidth * zoom;
  const height = image.naturalHeight * zoom;
  const x = (image.naturalWidth - width) / 2;
  const y = (image.naturalHeight - height) / 2;

  context.fillStyle = "#000000";
  context.fillRect(0, 0, image.naturalWidth, image.naturalHeight);
  context.drawImage(image, x, y, width, height);
}

function loadImage(imageData: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = imageData;
  });
}
