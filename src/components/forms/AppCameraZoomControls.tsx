import { Slider } from "zmp-ui";

import { Box } from "@/components/zaui";
import { CAMERA_ZOOM_RANGE } from "./cameraTorch";

type Props = {
  ready: boolean;
  zoom: number;
  zoomSupported: boolean;
  onZoomChange: (value: number) => void;
};

const ZOOM_PRESETS = [0.5, 1, 1.5];

export function AppCameraZoomControls({
  ready,
  zoom,
  zoomSupported,
  onZoomChange,
}: Props) {
  if (!zoomSupported) return;
  if (!ready) return

  return (
    <Box className="mx-auto w-full rounded-2xl py-4">
      <Slider
        max={CAMERA_ZOOM_RANGE.max}
        min={CAMERA_ZOOM_RANGE.min}
        step={CAMERA_ZOOM_RANGE.step}
        value={zoom}
        prefix={0.5}
        suffix={1}
        onChange={handleSliderChange(onZoomChange)}
      />
    </Box>
  );
}

function handleSliderChange(onZoomChange: (value: number) => void) {
  return (value: number | [number, number]) => {
    if (Array.isArray(value)) return;

    onZoomChange(value);
  };
}

function formatZoom(value: number) {
  return Number(value.toFixed(1)).toString();
}

function CameraZoomPlaceholder() {
  return (
    <Box className="mx-auto h-[78px] w-full max-w-[300px] rounded-2xl bg-white/40 px-4" />
  );
}
