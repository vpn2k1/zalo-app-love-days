import { useWatch } from "react-hook-form";

import { AppPageHeader } from "@/components/AppPageHeader";

import type {
  MemoryDetailFormProps,
  MemoryDetailFormValues,
} from "../types/MemoryDetailPageType";

export function MemoryDetailHeader({
  mode,
  onBack,
}: MemoryDetailFormProps) {
  const title = useWatch<MemoryDetailFormValues, "title">({
    name: "title",
    exact: true,
  });

  return (
    <AppPageHeader
      title={getTitle(mode)}
      subtitle={getSubtitle(mode, title)}
      onBack={onBack}
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
