import { AppCameraCapture } from "@/components/forms/AppCameraCapture";
import { pickImagePath } from "@/utils/imagePicker";

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
  return (
    <AppCameraCapture
      visible={visible}
      onCapture={onSelectImage}
      onClose={onClose}
      onPickAlbum={pickFromAlbum}
    />
  );
}

function pickFromAlbum() {
  return pickImagePath("album");
}
