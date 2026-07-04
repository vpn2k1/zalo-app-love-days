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
  profileLoading?: boolean;
  addAnniversaryLoading?: boolean;
  onAddPartner: () => Promise<unknown>;
  onSaveProfile: (payload: {
    display_name: string;
    custom_avatar_url: string | null;
  }) => Promise<unknown>;
  onUpdateStartDate: (startDate: string) => Promise<unknown>;
  onAddAnniversary: (draft: AnniversaryDraft) => Promise<unknown>;
  onEditProfile: () => void;
};

export type Person = {
  name: string;
  avatar?: string | null;
};

export type ZmpIconName = ComponentProps<typeof Icon>["icon"];
