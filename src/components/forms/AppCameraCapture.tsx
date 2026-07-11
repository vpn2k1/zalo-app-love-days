import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createCameraContext, PhotoFormat, PhotoQuality } from "zmp-sdk";

import { Box } from "@/components/zaui";
import {
  AppCameraCaptureControls,
  AppCameraCaptureHeader,
} from "./AppCameraCaptureControls";
import { AppCameraPreview } from "./AppCameraPreview";
import {
  getFacingMode,
  getNextFacing,
  isFrontCamera,
  stopCamera,
  type CameraFacing,
} from "./cameraCaptureHelpers";
import {
  canUseTorch,
  getCameraZoomRange,
  setCameraZoom,
  setTorchEnabled,
  type CameraZoomRange,
} from "./cameraTorch";

type Props = {
  visible: boolean;
  onCapture: (imageUrl: string) => void;
  onClose: () => void;
};
const DEFAULT_ZOOM_RANGE: CameraZoomRange = { max: 1, min: 1, step: 0.1 };

export function AppCameraCapture({ visible, onCapture, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraRef = useRef<ReturnType<typeof createCameraContext> | null>(null);
  const [error, setError] = useState("");
  const [facing, setFacing] = useState<CameraFacing>("back");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM_RANGE.min);
  const [zoomRange, setZoomRange] = useState(DEFAULT_ZOOM_RANGE);
  const [zoomSupported, setZoomSupported] = useState(false);

  useEffect(() => {
    if (!visible) return;

    let cancelled = false;
    const startCamera = async () => {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      setError("");
      setLoading(true);
      setReady(false);
      setTorchOn(false);
      setTorchSupported(false);
      setZoom(DEFAULT_ZOOM_RANGE.min);
      setZoomRange(DEFAULT_ZOOM_RANGE);
      setZoomSupported(false);
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
        const range = getCameraZoomRange(videoElement);
        if (range) {
          setZoomRange(range);
          setZoom(range.min);
          setZoomSupported(true);
          void setCameraZoom(videoElement, range.min);
        }
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

  if (!visible) return null;

  const close = () => {
    void setTorchEnabled(videoRef.current, false);
    stopCamera(cameraRef.current);
    cameraRef.current = null;
    onClose();
  };

  const flipCamera = () => {
    void setTorchEnabled(videoRef.current, false);
    setTorchOn(false);
    setZoom(DEFAULT_ZOOM_RANGE.min);
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
  const changeZoom = (value: number) => {
    const nextZoom = clampZoom(value, zoomRange);
    setZoom(nextZoom);
    void setCameraZoom(videoRef.current, nextZoom).catch((zoomError) => {
      console.error(zoomError);
      setZoomSupported(false);
    });
  };
  return createPortal(
    <Box
      className="fixed inset-0 z-[9999] overflow-hidden bg-[#fff4f8] text-[#3c2435]"
      role="dialog"
      aria-modal="true"
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <Box className="mx-auto flex h-full w-[min(100%,430px)] flex-col px-5 pb-[calc(26px+env(safe-area-inset-bottom))] pt-[max(22px,calc(14px+env(safe-area-inset-top)))]">
        <AppCameraCaptureHeader onClick={close} />

        <AppCameraPreview
          error={error}
          loading={loading}
          ready={ready}
          videoRef={videoRef}
        />
        <Box className="grid flex-1 content-center gap-6">
          <AppCameraCaptureControls
            ready={ready}
            torchOn={torchOn}
            torchSupported={torchSupported}
            zoom={zoom}
            zoomSupported={zoomSupported}
            onCapture={capture}
            onFlip={flipCamera}
            onToggleTorch={toggleTorch}
            onZoomChange={changeZoom}
          />
        </Box>
      </Box>
    </Box>,
    document.body,
  );
}

function clampZoom(value: number, range: CameraZoomRange) {
  if (value < range.min) return range.min;
  if (value > range.max) return range.max;

  return value;
}
