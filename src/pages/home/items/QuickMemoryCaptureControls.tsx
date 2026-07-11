import { Box, Button, Icon, Text } from "@/components/zaui";

type Props = {
  ready: boolean;
  onCapture: () => void;
  onFlip: () => void;
  onPickAlbum: () => void;
};

export function QuickMemoryCaptureControls({
  ready,
  onCapture,
  onFlip,
  onPickAlbum,
}: Props) {
  return (
    <Box className="rounded-[28px] bg-white/90 p-4 shadow-[0_14px_32px_rgba(201,47,103,0.1)]">
      <Box className="flex flex-col-3 items-center justify-around">
        <ControlButton icon="zi-auto-solid" onClick={onFlip} />
        <Box
          disabled={!ready}
          className="!size-16 !min-h-16 !min-w-16 rounded-full bg-white p-1 shadow-[0_10px_22px_rgba(217,70,126,0.24)]"
          aria-label="Chụp ảnh"
          onClick={onCapture}
        >
          <Box className="size-full rounded-full bg-[#d9467e]" />
        </Box>
        <ControlButton icon="zi-photo" onClick={onPickAlbum} />
      </Box>
    </Box>
  );
}

function ControlButton({
  icon,
  onClick,
}: {
  icon: "zi-auto-solid" | "zi-photo";
  onClick: () => void;
}) {
  return (
    <Box onClick={onClick}>
      <Box className="mx-auto grid size-12 place-items-center rounded-full bg-[#fff0f6] text-[#d9467e]">
        <Icon icon={icon} />
      </Box>
    </Box>
  );
}
