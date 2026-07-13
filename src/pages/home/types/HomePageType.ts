import type { ComponentProps } from "react";
import { Icon } from "@/components/zaui";
import type { Anniversary } from "@/types/anniversary";
import type { CalendarDateValue } from "@/types/date";

export type Person = {
  name: string;
  avatar?: string | null;
};

export type HomeFormValues = {
  backgroundUrl: string;
  coupleCreatedBy: string;
  coupleId: string;
  currentAvatar: string;
  currentName: string;
  memories: Anniversary[];
  partnerAvatar: string;
  partnerName: string;
  startDate: string;
};

export type DaysTogetherFormValues = {
  background: string;
  startDate: CalendarDateValue;
};

export type ElapsedTime = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export type ZmpIconName = ComponentProps<typeof Icon>["icon"];
