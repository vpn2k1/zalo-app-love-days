import type { AnniversaryDraft } from "@/types/anniversary";

export const ANNIVERSARY_REPEAT_OPTIONS = [
  { label: "Hàng năm", value: "yearly" },
  { label: "Không lặp", value: "none" },
];

export function getDefaultAnniversaryValues(
  defaultDate = "",
): AnniversaryDraft {
  return {
    title: "",
    date: defaultDate,
    repeat_type: "yearly",
    note: "",
    image_url: "",
  };
}
