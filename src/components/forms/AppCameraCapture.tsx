import { createPortal } from "react-dom";

import { Box } from "@/components/zaui";
import { useOverlayBackClose } from "@/components/zaui/useOverlayBackClose";

import {
  AppCameraCaptureControls,
  AppCameraCaptureHeader,
} from "./AppCameraCaptureControls";
import { AppCameraPreview } from "./AppCameraPreview";
import { useAppCameraCapture } from "./useAppCameraCapture";

type Props = {
  visible: boolean;
  onCapture: (imageUrl: string) => void;
  onClose: () => void;
  onPickAlbum: () => Promise<string>;
};

export function AppCameraCapture({
  visible,
  onCapture,
  onClose,
  onPickAlbum,
}: Props) {
  const camera = useAppCameraCapture({
    visible,
    onCapture,
    onClose,
    onPickAlbum,
  });
  useOverlayBackClose(visible, camera.close);

  if (!visible) return null;

  return createPortal(
    <Box
      className="fixed inset-0 z-[9999] overflow-hidden bg-[#fff4f8] text-[#3c2435]"
      role="dialog"
      aria-modal="true"
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <Box className="mx-auto flex justify-around h-[80%] w-[min(100%,430px)] flex-col px-5 pb-[calc(26px+env(safe-area-inset-bottom))] pt-[max(22px,calc(14px+env(safe-area-inset-top)))]">
        <AppCameraCaptureHeader onClick={camera.close} />

        <Box className="grid grid-cols-1">
          <AppCameraPreview
            error={camera.error}
            loading={camera.loading}
            mirrored={camera.mirrored}
            ready={camera.ready}
            videoRef={camera.videoRef}
            zoom={camera.zoom}
          />
          <AppCameraCaptureControls
            ready={camera.ready}
            zoom={camera.zoom}
            zoomSupported={camera.zoomSupported}
            onCapture={camera.capture}
            onFlip={camera.flipCamera}
            onPickAlbum={camera.pickAlbum}
            onZoomChange={camera.changeZoom}
          />
        </Box>
      </Box>
    </Box>,
    document.body,
  );
}
