import { useEffect, useState } from "react";
import { Button, Icon } from "zmp-ui";

import { imageSaveService } from "@/services/imageSaveService";
import { useAppSnackbar } from "@/components/zaui/useAppSnackbar";

type Props = {
  imageUrl: string;
};

export function AppImageViewerSaveButton({ imageUrl }: Props) {
  const [saving, setSaving] = useState(false);
  const snackbar = useAppSnackbar();

  useEffect(() => {
    setSaving(false);
  }, [imageUrl]);

  const saveImage = async () => {
    if (saving) return;

    setSaving(true);
    try {
      const result = await imageSaveService.save(imageUrl);
      showSaveSuccess(result, snackbar);
    } catch (error) {
      console.error(error);
      snackbar.showError("Không thể lưu ảnh. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Button
      htmlType="button"
      variant="tertiary"
      className="pointer-events-auto !size-11 !min-h-11 !min-w-11 rounded-full bg-white/15 p-0 text-white backdrop-blur-md"
      disabled={saving}
      icon={<Icon icon="zi-download" />}
      loading={saving}
      onClick={(event) => {
        event.stopPropagation();
        void saveImage();
      }}
    />
  );
}

function showSaveSuccess(
  result: Awaited<ReturnType<typeof imageSaveService.save>>,
  snackbar: ReturnType<typeof useAppSnackbar>,
) {
  if (result === "gallery") {
    snackbar.showSuccess("Đã lưu ảnh vào thư viện.");
    return;
  }

  snackbar.showSuccess("Đã mở tải ảnh.");
}
