import { useState } from "react";
import type { QueryClient } from "@tanstack/react-query";
import { useInviteAcceptance } from "@/pages/invite-accept/modules/useInviteAcceptance";
import type { AppUser } from "@/types/user";

type Input = {
  authorizeUser: () => Promise<AppUser>;
  inviteCode: string | null;
  queryClient: QueryClient;
  user: AppUser | null;
};

export function useInvitePageController({
  authorizeUser,
  inviteCode,
  queryClient,
  user,
}: Input) {
  const [inviteConflict, setInviteConflict] = useState("");
  const inviteAcceptance = useInviteAcceptance({
    authorizeUser,
    inviteCode,
    queryClient,
    setInviteConflict,
    user,
  });

  return {
    acceptInviteMutation: inviteAcceptance.acceptInviteMutation,
    closeInviteConflict: inviteAcceptance.closeInviteConflict,
    inviteConflict,
  };
}
