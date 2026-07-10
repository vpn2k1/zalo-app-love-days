import { FacingMode, createCameraContext } from "zmp-sdk";

export type CameraFacing = "back" | "front";

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

export function stopCamera(
  camera: ReturnType<typeof createCameraContext> | null,
) {
  if (!camera) return;

  camera.stop();
}
