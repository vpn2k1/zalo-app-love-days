import { Box, Button, Icon } from "@/components/zaui";

type Props = {
  ready: boolean;
  torchOn: boolean;
  torchSupported: boolean;
  zoom: number;
  zoomSupported: boolean;
  onCapture: () => void;
  onFlip: () => void;
  onToggleTorch: () => void;
  onZoomChange: (value: number) => void;
};

type ClickProps = { onClick: () => void };

const ZOOM_PRESETS = [0.5, 1, 2];

export function AppCameraCaptureHeader({ onClick }: ClickProps) {
  return (
    <Box className="mb-4 flex items-center justify-between px-2 [@media(max-height:680px)]:mb-2">
      <Button
        htmlType="button"
        variant="tertiary"
        className="!size-12 !min-h-12 !min-w-12 rounded-full bg-white/12 p-0 text-white backdrop-blur-md [@media(max-height:680px)]:!size-10 [@media(max-height:680px)]:!min-h-10 [@media(max-height:680px)]:!min-w-10"
        icon={<Icon icon="zi-close" />}
        aria-label="Đóng camera"
        onClick={onClick}
      />
    </Box>
  );
}

export function AppCameraCaptureControls({
  ready,
  torchOn,
  torchSupported,
  zoom,
  zoomSupported,
  onCapture,
  onFlip,
  onToggleTorch,
  onZoomChange,
}: Props) {
  return (
    <>
      <CameraZoomSlider
        ready={ready}
        zoom={zoom}
        zoomSupported={zoomSupported}
        onZoomChange={onZoomChange}
      />
      <Box className="grid grid-cols-3 place-items-center items-center pt-10 justify-between w-full">
        <Box
          className="size-14 min-h-14 min-w-14 rounded-full flex items-center justify-center"
          // disabled={!ready || !torchSupported}
          // onClick={onToggleTorch}
        >
          {/* <Icon icon="zi-radio-unchecked" /> */}
        </Box>

        <Box
          onClick={onCapture}
          className="size-14 min-h-14 min-w-14 bg-slate-50 rounded-full flex items-center justify-center"
        >
          <Box className="h-[50px] w-[50px] bg-[var(--love-primary)] rounded-full" />
        </Box>

        <Box
          onClick={onFlip}
          className="size-14 min-h-14 min-w-14 rounded-full flex items-center justify-center"
        >
          <Icon icon="zi-auto-solid" />
        </Box>
      </Box>
    </>
  );
}

type ZoomProps = {
  ready: boolean;
  zoom: number;
  zoomSupported: boolean;
  onZoomChange: (value: number) => void;
};

function CameraZoomSlider({
  ready,
  zoom,
  zoomSupported,
  onZoomChange,
}: ZoomProps) {
  if (!zoomSupported) {
    return <CameraZoomPlaceholder />;
  }

  if (!ready) {
    return <CameraZoomPlaceholder />;
  }

  return (
    <Box className="mx-auto mt-5 grid w-full max-w-[240px] grid-cols-3 gap-2 rounded-full bg-white/12 p-1.5 backdrop-blur-md [@media(max-height:680px)]:mt-2">
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

function TorchButton({
  active,
  disabled,
  onClick,
}: {
  active: boolean;
  disabled: boolean;
} & ClickProps) {
  return (
    <Button
      htmlType="button"
      disabled={disabled}
      variant="tertiary"
      className={getTorchButtonClassName(active)}
      aria-label={getTorchAriaLabel(active)}
      onClick={onClick}
    >
      Đèn
    </Button>
  );
}

function getTorchButtonClassName(active: boolean) {
  const base =
    "!size-14 !min-h-14 !min-w-14 rounded-full p-0 text-xs font-bold backdrop-blur-md [@media(max-height:680px)]:!size-12 [@media(max-height:680px)]:!min-h-12 [@media(max-height:680px)]:!min-w-12";
  if (active) return `${base} bg-[#ffc400] text-[#3c2435]`;

  return `${base} bg-white/12 text-white`;
}

function formatZoom(value: number) {
  return Number(value.toFixed(1)).toString();
}

function getZoomPresetClassName(active: boolean) {
  const base = "!h-8 rounded-full p-0 text-xs font-bold";
  if (active) return `${base} bg-white text-[#3c2435]`;

  return `${base} bg-transparent text-white`;
}

function isActiveZoom(current: number, value: number) {
  return Math.abs(current - value) < 0.01;
}

function getTorchAriaLabel(active: boolean) {
  if (active) return "Tắt đèn";

  return "Bật đèn";
}

function CameraZoomPlaceholder() {
  return (
    <Box className="mx-auto mt-5 h-10 w-full max-w-[320px] rounded-full bg-white/10 px-4 [@media(max-height:680px)]:mt-2 [@media(max-height:680px)]:h-8" />
  );
}
