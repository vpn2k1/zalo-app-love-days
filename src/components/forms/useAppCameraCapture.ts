import { useEffect, useRef, useState } from "react";
import { createCameraContext, PhotoFormat, PhotoQuality } from "zmp-sdk";

import {
  getFacingMode,
  getNextFacing,
  isFrontCamera,
  stopCamera,
  type CameraFacing,
} from "./cameraCaptureHelpers";
import {
  CAMERA_DEFAULT_ZOOM,
  CAMERA_ZOOM_RANGE,
  canUseTorch,
  clampCameraZoom,
  getCameraZoomRange,
  setCameraZoom,
  setTorchEnabled,
} from "./cameraTorch";

type Input = {
  visible: boolean; onCapture: (imageUrl: string) => void; onClose: () => void; onPickAlbum?: () => Promise<string>;
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
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [zoom, setZoom] = useState(CAMERA_DEFAULT_ZOOM);
  const [zoomRange, setZoomRange] = useState(CAMERA_ZOOM_RANGE);
  const [zoomSupported, setZoomSupported] = useState(false);

  useEffect(() => {
    if (!visible) return;

    let cancelled = false;
    const startCamera = async () => {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      resetCameraState();
      const camera = createCameraContext({
        videoElement,
        mediaConstraints: {
          audio: false,
          facingMode: getFacingMode(facing),
          height: 960,
          mirrored: isFrontCamera(facing),
          video: true,
          width: 720,
        },
      });
      cameraRef.current = camera;

      try {
        await camera.start();
        if (cancelled) {
          camera.stop();
          return;
        }
        setReady(true);
        setTorchSupported(canUseTorch(videoElement));
        syncZoomRange(videoElement);
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
    void setTorchEnabled(videoRef.current, false);
    stopCamera(cameraRef.current);
    cameraRef.current = null;
    onClose();
  };

  const flipCamera = () => {
    void setTorchEnabled(videoRef.current, false);
    setTorchOn(false);
    setZoom(CAMERA_DEFAULT_ZOOM);
    setFacing(getNextFacing);
  };

  const toggleTorch = async () => {
    if (!torchSupported) return;

    try {
      const nextTorchOn = !torchOn;
      await setTorchEnabled(videoRef.current, nextTorchOn);
      setTorchOn(nextTorchOn);
    } catch (torchError) {
      console.error(torchError);
      setTorchOn(false);
      setTorchSupported(false);
      setError("Thiết bị này không hỗ trợ bật đèn.");
    }
  };

  const capture = () => {
    const camera = cameraRef.current;
    if (!camera) return;

    const frame = camera.takePhoto({
      format: PhotoFormat.JPEG,
      quality: PhotoQuality.HIGH,
      useVideoSourceSize: true,
    });
    if (!frame?.data) {
      setError("Không thể chụp ảnh. Vui lòng thử lại.");
      return;
    }
    onCapture(frame.data);
    close();
  };

  const pickAlbum = getPickAlbumAction({ close, onCapture, onPickAlbum, setError });
  const changeZoom = (value: number) => {
    const nextZoom = clampCameraZoom(value, zoomRange);
    setZoom(nextZoom);
    void setCameraZoom(videoRef.current, nextZoom).catch((zoomError) => {
      console.error(zoomError);
      setZoomSupported(false);
    });
  };

  const resetCameraState = () => {
    setError("");
    setLoading(true);
    setReady(false);
    setTorchOn(false);
    setTorchSupported(false);
    setZoom(CAMERA_DEFAULT_ZOOM);
    setZoomRange(CAMERA_ZOOM_RANGE);
    setZoomSupported(false);
  };

  const syncZoomRange = (videoElement: HTMLVideoElement) => {
    const range = getCameraZoomRange(videoElement);
    if (!range) return;

    setZoomRange(range);
    setZoom(CAMERA_DEFAULT_ZOOM);
    setZoomSupported(true);
    void setCameraZoom(
      videoElement,
      clampCameraZoom(CAMERA_DEFAULT_ZOOM, range),
    );
  };

  return {
    capture, changeZoom, close, error, flipCamera, loading, pickAlbum, ready, toggleTorch, torchOn, torchSupported, videoRef, zoom, zoomSupported,
  };
}

function getPickAlbumAction({
  close,
  onCapture,
  onPickAlbum,
  setError,
}: {
  close: () => void; onCapture: (imageUrl: string) => void;
  onPickAlbum?: () => Promise<string>; setError: (error: string) => void;
}) {
  if (!onPickAlbum) return undefined;

  return async () => {
    setError("");
    try {
      const image = await onPickAlbum();
      if (!image) return;

      onCapture(image);
      close();
    } catch (pickerError) {
      console.error(pickerError);
      setError("Không thể chọn ảnh. Vui lòng thử lại.");
    }
  };
}
