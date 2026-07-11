type TorchConstraint = MediaTrackConstraints & {
  advanced?: Array<
    MediaTrackConstraintSet & { torch?: boolean; zoom?: number }
  >;
};

type TorchCapabilities = MediaTrackCapabilities & {
  torch?: boolean;
  zoom?: {
    max: number;
    min: number;
    step?: number;
  };
};

type TorchTrack = MediaStreamTrack & {
  applyConstraints: (constraints: TorchConstraint) => Promise<void>;
};

export function canUseTorch(videoElement: HTMLVideoElement) {
  const track = getVideoTrack(videoElement);
  if (!track) return false;

  return Boolean(getTorchCapabilities(track).torch);
}

export type CameraZoomRange = {
  max: number;
  min: number;
  step: number;
};

export const CAMERA_DEFAULT_ZOOM = 1;
export const CAMERA_ZOOM_RANGE: CameraZoomRange = { max: 1.5, min: 0.5, step: 0.1 };

export function clampCameraZoom(value: number, range: CameraZoomRange) {
  if (value < range.min) return range.min;
  if (value > range.max) return range.max;

  return value;
}

export function getCameraZoomRange(
  videoElement: HTMLVideoElement,
): CameraZoomRange | null {
  const track = getVideoTrack(videoElement);
  if (!track) return null;

  const zoom = getTorchCapabilities(track).zoom;
  if (!zoom) return null;

  return {
    max: zoom.max,
    min: zoom.min,
    step: zoom.step ?? 0.1,
  };
}

export async function setCameraZoom(
  videoElement: HTMLVideoElement | null,
  zoom: number,
) {
  const track = getVideoTrack(videoElement);
  if (!track) return;
  if (!getTorchCapabilities(track).zoom) return;

  await (track as TorchTrack).applyConstraints({
    advanced: [{ zoom }],
  });
}

export async function setTorchEnabled(
  videoElement: HTMLVideoElement | null,
  enabled: boolean,
) {
  const track = getVideoTrack(videoElement);
  if (!track) return;
  if (!getTorchCapabilities(track).torch) return;

  await (track as TorchTrack).applyConstraints({
    advanced: [{ torch: enabled }],
  });
}

function getVideoTrack(videoElement: HTMLVideoElement | null) {
  const stream = videoElement?.srcObject;
  if (!(stream instanceof MediaStream)) return null;

  return stream.getVideoTracks()[0] ?? null;
}

function getTorchCapabilities(track: MediaStreamTrack) {
  return track.getCapabilities() as TorchCapabilities;
}
