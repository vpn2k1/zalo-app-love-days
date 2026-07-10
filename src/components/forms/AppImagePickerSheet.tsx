import { Box, Button, Icon, Text } from "@/components/zaui";

type Props = {
  onClose: () => void;
  onOpenCamera: () => void;
  onPickAlbum: () => void;
};

export function AppImagePickerSheet({
  onClose,
  onOpenCamera,
  onPickAlbum,
}: Props) {
  return (
    <Box
      className="app-image-picker-sheet px-4 pb-[calc(34px+env(safe-area-inset-bottom))] pt-2"
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
      onTouchStart={(event) => event.stopPropagation()}
    >
      <Box className="overflow-hidden rounded-2xl bg-white">
        <AppImagePickerSheetAction
          icon="zi-add-photo"
          label="Chọn ảnh"
          onClick={onPickAlbum}
        />
        <Box className="h-px bg-[#f0dce6]" />
        <AppImagePickerSheetAction
          icon="zi-camera"
          label="Chụp ảnh"
          onClick={onOpenCamera}
        />
      </Box>
      <Button
        fullWidth
        htmlType="button"
        className="mt-3 !h-12 rounded-2xl bg-white font-bold text-[#3c2435]"
        variant="tertiary"
        onClick={onClose}
      >
        Đóng
      </Button>
    </Box>
  );
}

type ActionProps = {
  icon: "zi-add-photo" | "zi-camera";
  label: string;
  onClick: () => void;
};

function AppImagePickerSheetAction({ icon, label, onClick }: ActionProps) {
  return (
    <Button
      fullWidth
      htmlType="button"
      className="!h-[58px] justify-start rounded-none bg-white px-4 text-left text-[#3c2435]"
      variant="tertiary"
      onClick={onClick}
    >
      <Box className="flex w-full items-center gap-3">
        <Box className="grid size-9 place-items-center rounded-full bg-[#fff0f6] text-lg text-[#d9467e]">
          <Icon icon={icon} />
        </Box>
        <Text className="font-bold text-[#3c2435]">{label}</Text>
      </Box>
    </Button>
  );
}
