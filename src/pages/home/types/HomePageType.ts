import type { ComponentProps } from "react";
import { Icon } from "@/components/zaui";
import type { Anniversary, AnniversaryDraft } from "@/types/anniversary";
import type { CoupleWithMembers } from "@/types/couple";
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
  blockingMessage: string | null;
  onAddPartner: () => Promise<unknown>;
  onAddAnniversary: (draft: AnniversaryDraft) => Promise<unknown>;
  onEditProfile: () => void;
  onUpdateBackground?: (url: string) => Promise<unknown>;
};

export type Person = {
  name: string;
  avatar?: string | null;
};

export type HomeDisplayFormValues = {
  backgroundUrl: string;
  currentAvatar: string;
  currentName: string;
  memories: Anniversary[];
  partnerAvatar: string;
  partnerName: string;
  startDate: string;
  coupleId: string;
};

export type ZmpIconName = ComponentProps<typeof Icon>["icon"];
