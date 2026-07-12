import type { ComponentProps } from "react";
import { Icon } from "@/components/zaui";
import type { Anniversary, AnniversaryDraft } from "@/types/anniversary";
import type { CoupleWithMembers } from "@/types/couple";
import type { CalendarDateValue } from "@/types/date";
import type { AppUser } from "@/types/user";

export type HomePageProps = {
  user: AppUser;
};

export type HomePageContentProps = {
  user: AppUser;
  coupleData: CoupleWithMembers;
  anniversaries: Anniversary[];
  addPartnerLoading?: boolean;
  addAnniversaryLoading?: boolean;
  refreshing?: boolean;
  blockingMessage: string | null;
  onAddPartner: () => Promise<unknown>;
  onAddAnniversary: (draft: AnniversaryDraft) => Promise<unknown>;
  onEditProfile: () => void;
  onRefresh: () => Promise<unknown>;
  onUpdateBackground?: (url: string) => Promise<unknown>;
};

export type Person = {
  name: string;
  avatar?: string | null;
};

export type HomeDisplayFormValues = {
  backgroundUrl: string;
  background: string;
  currentAvatar: string;
  currentName: string;
  memories: Anniversary[];
  partnerAvatar: string;
  partnerName: string;
  startDate: string;
  coupleId: string;
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
