import type { AnniversaryDraft } from "@/types/anniversary";

export type SetupFormValues = {
  startDate: string;
  displayName: string;
  customAvatarUrl: string;
  backgroundUrl: string;
  anniversaries: AnniversaryDraft[];
};
