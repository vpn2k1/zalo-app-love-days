import type { Anniversary } from "@/types/anniversary";
import { todayDateString } from "@/utils/date";
import type { MemoryDetailFormValues } from "../types/MemoryDetailPageType";

export function getCreateMemoryDetailDefaultValues(
  imageUrl = "",
): MemoryDetailFormValues {
  return {
    date: todayDateString(),
    image_url: imageUrl,
    note: "",
    repeat_type: "yearly",
    title: "",
  };
}

export function getMemoryDetailDefaultValues(
  memory: Anniversary,
): MemoryDetailFormValues {
  return {
    date: memory.date,
    image_url: memory.image_url ?? "",
    note: memory.note ?? "",
    repeat_type: memory.repeat_type,
    title: memory.title,
  };
}

export function normalizeMemoryDetailValues(
  values: MemoryDetailFormValues,
): MemoryDetailFormValues {
  return {
    date: values.date,
    image_url: values.image_url?.trim(),
    note: values.note?.trim(),
    repeat_type: values.repeat_type,
    title: values.title.trim(),
  };
}

export function getCanUpdate(
  isDirty: boolean,
  isValid: boolean,
  loading: boolean,
) {
  if (loading) return false;
  if (!isValid) return false;
  if (!isDirty) return false;

  return true;
}

export function getCanCreate(isValid: boolean, loading: boolean) {
  if (loading) return false;
  if (!isValid) return false;

  return true;
}
