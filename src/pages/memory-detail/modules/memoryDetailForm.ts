import type { Anniversary, AnniversaryUpdateInput } from "@/types/anniversary";
import { todayDateString } from "@/utils/date";
import type { MemoryDetailFormValues } from "../types/MemoryDetailPageType";

export function getCreateMemoryDetailDefaultValues(
  imageUrl = "",
): AnniversaryUpdateInput {
  return {
    date: todayDateString(),
    image_url: imageUrl,
    image_urls: getImageUrls(imageUrl),
    note: "",
    repeat_type: "yearly",
    title: "",
  };
}

export function getMemoryDetailDefaultValues(
  memory: Anniversary,
): AnniversaryUpdateInput {
  return {
    date: memory.date,
    image_url: memory.image_url ?? "",
    image_urls: getMemoryImageUrls(memory),
    note: memory.note ?? "",
    repeat_type: memory.repeat_type,
    title: memory.title,
  };
}

export function normalizeMemoryDetailValues(
  values: MemoryDetailFormValues,
): AnniversaryUpdateInput {
  const imageUrls = normalizeImageUrls(values.image_urls);
  return {
    date: values.date,
    image_url: imageUrls[0] ?? "",
    image_urls: imageUrls,
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

function getMemoryImageUrls(memory: Anniversary) {
  if (memory.image_urls && memory.image_urls.length > 0) {
    return normalizeImageUrls(memory.image_urls);
  }

  return getImageUrls(memory.image_url ?? "");
}

function getImageUrls(imageUrl: string) {
  if (!imageUrl) return [];

  return [imageUrl];
}

function normalizeImageUrls(imageUrls?: string[]) {
  if (!imageUrls) return [];

  return imageUrls.map((item) => item.trim()).filter(Boolean);
}
