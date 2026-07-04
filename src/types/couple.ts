import type { AppUser } from "@/types/user";

export type Couple = {
  id: string;
  start_date: string;
  title: string;
  theme: string;
  background_url?: string | null;
  created_by: string;
  created_at?: string;
  updated_at?: string;
};

export type CoupleMemberRole = "owner" | "partner";
export type CoupleMemberSide = "left" | "right";

export type CoupleMember = {
  id: string;
  couple_id: string;
  user_id: string;
  role: CoupleMemberRole;
  side: CoupleMemberSide;
  joined_at?: string;
  user?: AppUser;
};

export type CoupleWithMembers = {
  couple: Couple;
  members: CoupleMember[];
};

export type SetupCoupleInput = {
  startDate: string;
  displayName: string;
  customAvatarUrl: string | null;
  backgroundUrl: string | null;
  anniversaries: Array<{
    title: string;
    date: string;
    repeat_type: "yearly" | "none";
    note?: string;
    image_url?: string;
  }>;
};
