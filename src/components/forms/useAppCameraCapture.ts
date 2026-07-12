import { useEffect, useRef, useState } from "react";
import { createCameraContext, PhotoFormat, PhotoQuality } from "zmp-sdk";

import { getPickAlbumAction } from "./cameraAlbumAction";
import {
  getCameraCaptureConstraints,
  getNextFacing,
  isFrontCamera,
  stopCamera,
  type CameraFacing,
} from "./cameraCaptureHelpers";
import {
  CAMERA_DEFAULT_ZOOM,
  CAMERA_ZOOM_RANGE,
  clampCameraZoom,
  cropImageDataToZoom,
} from "./cameraZoom";

const CAMERA_PHOTO_HEIGHT = 2560;
const CAMERA_PHOTO_WIDTH = 1920;

type Input = {
  visible: boolean; onCapture: (imageUrl: string) => void;
  onClose: () => void; onPickAlbum: () => Promise<string>;
};

export function useAppCameraCapture({
  visible,
  onCapture,
  onClose,
  onPickAlbum,
}: Input) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraRef = useRef<ReturnType<typeof createCameraContext> | null>(null);
  const [error, setError] = useState("");
  const [facing, setFacing] = useState<CameraFacing>("back");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [zoom, setZoom] = useState(CAMERA_DEFAULT_ZOOM);
  const [zoomSupported, setZoomSupported] = useState(false);

  useEffect(() => {
    if (!visible) return;

    let cancelled = false;
    const startCamera = async () => {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      resetCameraState();

      try {
        const camera = await startCameraWithBestResolution(videoElement, facing);
        if (cancelled) {
          camera.stop();
          return;
        }
        cameraRef.current = camera;
        setReady(true);
        setZoomSupported(true);
      } catch (cameraError) {
        console.error(cameraError);
        setError("Không thể mở camera. Vui lòng kiểm tra quyền camera.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void startCamera();

    return () => {
      cancelled = true;
      stopCamera(cameraRef.current);
      cameraRef.current = null;
    };
  }, [facing, visible]);

  const close = () => {
    stopCamera(cameraRef.current);
    cameraRef.current = null;
    onClose();
  };

  const flipCamera = () => {
    setZoom(CAMERA_DEFAULT_ZOOM);
    setFacing(getNextFacing);
  };

  const capture = async () => {
    const camera = cameraRef.current;
    if (!camera) return;

    const frame = camera.takePhoto({
      format: PhotoFormat.JPEG,
      minScreenshotHeight: CAMERA_PHOTO_HEIGHT,
      minScreenshotWidth: CAMERA_PHOTO_WIDTH,
      quality: PhotoQuality.HIGH,
      useVideoSourceSize: true,
    });
    if (!frame?.data) {
      setError("Không thể chụp ảnh. Vui lòng thử lại.");
      return;
    }

    await captureZoomedFrame(frame.data);
  };

  const pickAlbum = getPickAlbumAction({
    close,
    onCapture,
    onPickAlbum,
    setError,
  });
  const changeZoom = (value: number) => {
    const nextZoom = clampCameraZoom(value, CAMERA_ZOOM_RANGE);
    setZoom(nextZoom);
  };

  const resetCameraState = () => {
    setError("");
    setLoading(true);
    setReady(false);
    setZoom(CAMERA_DEFAULT_ZOOM);
    setZoomSupported(false);
  };

  const captureZoomedFrame = async (imageData: string) => {
    try {
      onCapture(await cropImageDataToZoom(imageData, zoom));
      close();
    } catch (cropError) {
      console.error(cropError);
      onCapture(imageData);
      close();
    }
  };

  return {
    capture, changeZoom, close, error, flipCamera, loading, pickAlbum, ready,
    mirrored: isFrontCamera(facing), videoRef, zoom, zoomSupported,
  };
}

async function startCameraWithBestResolution(
  videoElement: HTMLVideoElement,
  facing: CameraFacing,
) {
  const constraints = getCameraCaptureConstraints(facing);
  let lastError: unknown = null;

  for (const mediaConstraints of constraints) {
    const camera = createCameraContext({ mediaConstraints, videoElement });

    try {
      await camera.start();
      return camera;
    } catch (cameraError) {
      lastError = cameraError;
      stopCamera(camera);
    }
  }

  throw lastError;
}
