import { FacingMode, createCameraContext } from "zmp-sdk";

export type CameraFacing = "back" | "front";

const CAMERA_HIGH_RESOLUTION_HEIGHT = 2560;
const CAMERA_HIGH_RESOLUTION_WIDTH = 1920;
const CAMERA_FALLBACK_HEIGHT = 1440;
const CAMERA_FALLBACK_WIDTH = 1080;

export function getFacingMode(facing: CameraFacing) {
  if (facing === "front") return FacingMode.FRONT;

  return FacingMode.BACK;
}

export function getNextFacing(facing: CameraFacing): CameraFacing {
  if (facing === "back") return "front";

  return "back";
}

export function isFrontCamera(facing: CameraFacing) {
  return facing === "front";
}

export function getCameraCaptureConstraints(facing: CameraFacing) {
  const facingMode = getFacingMode(facing);

  return [
    {
      audio: false,
      facingMode,
      height: CAMERA_HIGH_RESOLUTION_HEIGHT,
      mirrored: isFrontCamera(facing),
      video: true,
      width: CAMERA_HIGH_RESOLUTION_WIDTH,
    },
    {
      audio: false,
      facingMode,
      height: CAMERA_FALLBACK_HEIGHT,
      mirrored: isFrontCamera(facing),
      video: true,
      width: CAMERA_FALLBACK_WIDTH,
    },
  ];
}

export function stopCamera(
  camera: ReturnType<typeof createCameraContext> | null,
) {
  if (!camera) return;

  camera.stop();
}
