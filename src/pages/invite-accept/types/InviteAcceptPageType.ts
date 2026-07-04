import type { AppUser } from "@/types/user";

export type InviteAcceptPageProps = {
  authorizeUser: () => Promise<AppUser>;
  inviteCode: string | null;
  user: AppUser | null;
};
