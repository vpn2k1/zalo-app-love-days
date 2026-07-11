import { Box, Button, Icon } from "@/components/zaui";
import { AppCameraZoomControls } from "./AppCameraZoomControls";

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

export function AppCameraCaptureHeader({ onClick }: ClickProps) {
  return (
    <Box className="flex-1 flex items-center">
      <Box
        onClick={onClick}
        className="size-12 min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-white p-0 shadow-[0_12px_24px_rgba(84,49,72,0.12)]"
      >
        <Icon
          icon="zi-close-circle-solid"
          size={30}
          className="text-[var(--love-primary)]"
        />
      </Box>
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
    <Box className="grid gap-4">
      <AppCameraZoomControls
        ready={ready}
        zoom={zoom}
        zoomSupported={zoomSupported}
        onZoomChange={onZoomChange}
      />
      <Box className="rounded-[28px] bg-white/90 p-4 shadow-[0_14px_32px_rgba(201,47,103,0.1)]">
        <Box className="flex flex-col-3 items-center justify-around">
          <TorchButton
            active={torchOn}
            disabled={!ready || !torchSupported}
            onClick={onToggleTorch}
          />
          <CaptureButton ready={ready} onClick={onCapture} />
          <IconButton
            icon="zi-auto-solid"
            label="Đổi camera"
            onClick={onFlip}
          />
        </Box>
      </Box>
    </Box>
  );
}

function CaptureButton({ ready, onClick }: { ready: boolean } & ClickProps) {
  const capture = () => {
    if (!ready) return;

    onClick();
  };

  return (
    <Box
      aria-disabled={!ready}
      aria-label="Chụp ảnh"
      className="!size-16 !min-h-16 !min-w-16 rounded-full bg-white p-1 shadow-[0_10px_22px_rgba(217,70,126,0.24)]"
      onClick={capture}
    >
      <Box className="size-full rounded-full bg-[#d9467e]" />
    </Box>
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
  const toggle = () => {
    if (disabled) return;

    onClick();
  };

  return (
    <Box
      aria-disabled={disabled}
      aria-label={getTorchAriaLabel(active)}
      onClick={toggle}
    >
      <Box className={getTorchButtonClassName(active)}>
        <Icon icon={getTorchIcon(active)} />
      </Box>
    </Box>
  );
}

function IconButton({
  icon,
  label,
  onClick,
}: {
  icon: "zi-auto-solid";
  label: string;
  onClick: () => void;
}) {
  return (
    <Box aria-label={label} onClick={onClick}>
      <Box className="mx-auto grid size-12 place-items-center rounded-full bg-[#fff0f6] text-[#d9467e]">
        <Icon icon={icon} />
      </Box>
    </Box>
  );
}

function getTorchButtonClassName(active: boolean) {
  const base = "mx-auto grid size-12 place-items-center rounded-full";
  if (active) return `${base} bg-[#d9467e] text-white`;

  return `${base} bg-[#fff0f6] text-[#d9467e]`;
}

function getTorchIcon(active: boolean) {
  if (active) return "zi-radio-checked";

  return "zi-radio-unchecked";
}

function getTorchAriaLabel(active: boolean) {
  if (active) return "Tắt đèn";

  return "Bật đèn";
}
