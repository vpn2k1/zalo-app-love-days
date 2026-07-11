import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createCameraContext, PhotoFormat, PhotoQuality } from "zmp-sdk";

import { Box, Button, Icon, Text } from "@/components/zaui";
import {
  getFacingMode,
  getNextFacing,
  isFrontCamera,
  stopCamera,
  type CameraFacing,
} from "@/components/forms/cameraCaptureHelpers";
import { pickImagePath } from "@/utils/imagePicker";
import { QuickMemoryCaptureControls } from "./QuickMemoryCaptureControls";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
};

export function QuickMemoryCaptureModal({
  visible,
  onClose,
  onSelectImage,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraRef = useRef<ReturnType<typeof createCameraContext> | null>(null);
  const [error, setError] = useState("");
  const [facing, setFacing] = useState<CameraFacing>("back");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!visible) return;

    let cancelled = false;
    const startCamera = async () => {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      setError("");
      setLoading(true);
      setReady(false);
      const camera = createCameraContext({
        videoElement,
        mediaConstraints: {
          audio: false,
          facingMode: getFacingMode(facing),
          height: 960,
          mirrored: isFrontCamera(facing),
          video: true,
          width: 960,
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
    stopCamera(cameraRef.current);
    cameraRef.current = null;
    onClose();
  };

  const flipCamera = () => {
    setFacing(getNextFacing);
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

    onSelectImage(frame.data);
    close();
  };

  const pickFromAlbum = async () => {
    setError("");
    try {
      const image = await pickImagePath("album");
      if (!image) return;

      onSelectImage(image);
      close();
    } catch (pickerError) {
      console.error(pickerError);
      setError("Không thể chọn ảnh. Vui lòng thử lại.");
    }
  };

  return createPortal(
    <Box
      className="fixed inset-0 z-[9999] bg-white"
      role="dialog"
      aria-modal="true"
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <Box className="mx-auto px-5 pb-[calc(26px+env(safe-area-inset-bottom))] grid justify-around grid-cols-1 h-full">
        <Box className="flex-1 flex items-center">
          <Box onClick={close} className="size-12 min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-white p-0 shadow-[0_12px_24px_rgba(84,49,72,0.12)]">
            <Icon
              icon="zi-close-circle-solid"
              size={30}
              className="text-[var(--love-primary)]"
            />
          </Box>
        </Box>
        <Box className="grid gap-6">
          <Box className="relative aspect-square w-full overflow-hidden rounded-3xl bg-black shadow-[0_18px_42px_rgba(84,49,72,0.16)]">
            <video
              ref={videoRef}
              autoPlay
              className={getVideoClassName(ready)}
              muted
              playsInline
            />
            {(loading || error) && (
              <Box className="absolute inset-0 grid place-items-center bg-black/45 px-6 text-center">
                {loading && (
                  <Text className="text-sm font-bold text-white">
                    Đang mở camera...
                  </Text>
                )}
                {error && (
                  <Text className="text-sm font-bold text-white">{error}</Text>
                )}
              </Box>
            )}
          </Box>
          <Box>
            <QuickMemoryCaptureControls
              ready={ready}
              onCapture={capture}
              onFlip={flipCamera}
              onPickAlbum={pickFromAlbum}
            />
          </Box>
        </Box>
      </Box>
    </Box>,
    document.body,
  );
}

function getVideoClassName(ready: boolean) {
  const base = "absolute inset-0 size-full object-cover transition-opacity";
  if (ready) return `${base} opacity-100`;

  return `${base} opacity-0`;
}
