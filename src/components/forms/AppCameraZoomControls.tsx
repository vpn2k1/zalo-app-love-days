import { Slider } from "zmp-ui";

import { Box } from "@/components/zaui";
import { CAMERA_ZOOM_RANGE } from "./cameraZoom";

type Props = {
  ready: boolean;
  zoom: number;
  zoomSupported: boolean;
  onZoomChange: (value: number) => void;
};

export function AppCameraZoomControls({
  ready,
  zoom,
  zoomSupported,
  onZoomChange,
}: Props) {
  if (!zoomSupported || !ready)
    return <Box className="mx-auto w-full rounded-2xl py-4" />;

  return (
    <Box className="mx-auto w-full rounded-2xl py-4">
      <Slider
        max={CAMERA_ZOOM_RANGE.max}
        min={CAMERA_ZOOM_RANGE.min}
        step={CAMERA_ZOOM_RANGE.step}
        value={zoom}
        prefix={CAMERA_ZOOM_RANGE.min}
        suffix={CAMERA_ZOOM_RANGE.max}
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
