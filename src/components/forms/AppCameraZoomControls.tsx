import { Box, Button } from "@/components/zaui";

type Props = {
  ready: boolean;
  zoom: number;
  zoomSupported: boolean;
  onZoomChange: (value: number) => void;
};

const ZOOM_PRESETS = [0.5, 1, 2];

export function AppCameraZoomControls({
  ready,
  zoom,
  zoomSupported,
  onZoomChange,
}: Props) {
  if (!zoomSupported) return <CameraZoomPlaceholder />;
  if (!ready) return <CameraZoomPlaceholder />;

  return (
    <Box className="mx-auto grid w-full max-w-[240px] grid-cols-3 gap-2 rounded-full bg-white/80 p-1.5 shadow-[0_10px_22px_rgba(84,49,72,0.08)]">
      {ZOOM_PRESETS.map((value) => (
        <ZoomPresetButton
          key={value}
          active={isActiveZoom(zoom, value)}
          value={value}
          onClick={onZoomChange}
        />
      ))}
    </Box>
  );
}

function ZoomPresetButton({
  active,
  value,
  onClick,
}: {
  active: boolean;
  value: number;
  onClick: (value: number) => void;
}) {
  return (
    <Button
      htmlType="button"
      variant="tertiary"
      className={getZoomPresetClassName(active)}
      onClick={() => onClick(value)}
    >
      {formatZoom(value)}x
    </Button>
  );
}

function formatZoom(value: number) {
  return Number(value.toFixed(1)).toString();
}

function getZoomPresetClassName(active: boolean) {
  const base = "!h-8 rounded-full p-0 text-xs font-bold";
  if (active) return `${base} bg-[#d9467e] text-white`;

  return `${base} bg-transparent text-[#6f5264]`;
}

function isActiveZoom(current: number, value: number) {
  return Math.abs(current - value) < 0.01;
}

function CameraZoomPlaceholder() {
  return (
    <Box className="mx-auto h-10 w-full max-w-[240px] rounded-full bg-white/40 px-4" />
  );
}
