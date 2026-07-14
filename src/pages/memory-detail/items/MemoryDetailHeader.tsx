import { useWatch } from "react-hook-form";

import { AppPageHeader } from "@/components/AppPageHeader";
import { Button, Icon } from "@/components/zaui";

import type {
  MemoryDetailFormProps,
  MemoryDetailFormValues,
} from "../types/MemoryDetailPageType";

export function MemoryDetailHeader({
  canDelete,
  mode,
  onBack,
  onDelete,
}: MemoryDetailFormProps) {
  const title = useWatch<MemoryDetailFormValues, "title">({
    name: "title",
    exact: true,
  });

  return (
    <AppPageHeader
      action={
        <MemoryDeleteAction
          canDelete={canDelete}
          mode={mode}
          onDelete={onDelete}
        />
      }
      title={getTitle(mode)}
      subtitle={getSubtitle(mode, title)}
      onBack={onBack}
    />
  );
}

function MemoryDeleteAction({
  canDelete,
  mode,
  onDelete,
}: Pick<MemoryDetailFormProps, "canDelete" | "mode" | "onDelete">) {
  if (mode !== "update") return null;
  if (!canDelete) return null;
  if (!onDelete) return null;

  return (
    <Button
      className="!size-10 !min-h-10 !min-w-10 rounded-full bg-[#fff0f0] p-0 text-[#dc2626]"
      htmlType="button"
      icon={<Icon icon="zi-delete" />}
      variant="tertiary"
      onClick={onDelete}
    />
  );
}

function getTitle(mode: MemoryDetailFormProps["mode"]) {
  if (mode === "create") return "Tạo kỷ niệm";

  return "Chi tiết kỷ niệm";
}

function getSubtitle(mode: MemoryDetailFormProps["mode"], title?: string) {
  if (mode === "create") return "Lưu lại một ngày đáng nhớ của hai bạn";
  if (title) return title;

  return "Kỷ niệm của hai bạn";
}
