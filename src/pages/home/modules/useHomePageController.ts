import { useAnniversaryMutation } from "@/pages/home/modules/useAnniversaryMutation";
import { useInvitePartnerMutation } from "@/pages/home/modules/useInvitePartnerMutation";
import type { CoupleWithMembers } from "@/types/couple";
import type { AppUser } from "@/types/user";

type Input = {
  coupleData: CoupleWithMembers | null;
  user: AppUser | null;
};

export function useHomePageController({ coupleData, user }: Input) {
  const invitePartner = useInvitePartnerMutation({ coupleData, user });
  const addAnniversaryMutation = useAnniversaryMutation({
    coupleData,
    user,
  });

  return {
    addAnniversaryMutation,
    invitePartnerMutation: invitePartner.invitePartnerMutation,
  };
}
