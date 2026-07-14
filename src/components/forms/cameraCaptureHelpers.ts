import { FacingMode, createCameraContext, type PhotoConstraint } from "zmp-sdk";

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

export function getCameraCaptureConstraints(facing: CameraFacing) {
  const facingMode = getFacingMode(facing);

  return [
    {
      audio: false,
      facingMode,
      mirrored: isFrontCamera(facing),
      video: true,
    },
  ];
}

export function getCameraPhotoConstraint(
  videoElement: HTMLVideoElement | null,
): PhotoConstraint {
  return {
    ...getCameraPhotoSize(videoElement),
    useVideoSourceSize: true,
  };
}

function getCameraPhotoSize(videoElement: HTMLVideoElement | null) {
  if (!videoElement?.videoWidth || !videoElement.videoHeight) return {};

  return {
    height: videoElement.videoHeight,
    width: videoElement.videoWidth,
  };
}

export function stopCamera(
  camera: ReturnType<typeof createCameraContext> | null,
) {
  if (!camera) return;

  camera.stop();
}
