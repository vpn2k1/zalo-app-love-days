import { Slider } from "zmp-ui";

import { Box } from "@/components/zaui";
import type { CameraZoomRange } from "./cameraZoom";

type Props = {
  ready: boolean;
  zoom: number;
  zoomRange: CameraZoomRange;
  zoomSupported: boolean;
  onZoomChange: (value: number) => void;
};

export function AppCameraZoomControls({
  ready,
  zoom,
  zoomRange,
  zoomSupported,
  onZoomChange,
}: Props) {
  if (!zoomSupported || !ready)
    return <Box className="mx-auto w-full rounded-2xl py-4" />;

  return (
    <Box className="mx-auto w-full rounded-2xl py-4">
      <Slider
        max={zoomRange.max}
        min={zoomRange.min}
        step={zoomRange.step}
        value={zoom}
        prefix={zoomRange.min}
        suffix={zoomRange.max}
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
