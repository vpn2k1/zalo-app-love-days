import { useAnniversariesData } from "@/hooks/useAnniversariesData";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useCoupleData } from "@/hooks/useCoupleData";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useLeaveCoupleMutation } from "@/hooks/mutations/useLeaveCoupleMutation";
import { useUpdateBackgroundMutation } from "@/hooks/mutations/useUpdateBackgroundMutation";

import type { HomePageContentProps } from "../types/HomePageType";
import { useAnniversaryMutation } from "./useAnniversaryMutation";
import { useInvitePartnerMutation } from "./useInvitePartnerMutation";

export function useHomePageController() {
  const { user } = useCurrentUser();
  const { coupleData, coupleQuery } = useCoupleData();
  const { anniversariesQuery } = useAnniversariesData(
    coupleData?.couple.id || "",
  );
  const addAnniversary = useAnniversaryMutation();
  const invitePartner = useInvitePartnerMutation();
  const leaveCouple = useLeaveCoupleMutation();
  const updateBackground = useUpdateBackgroundMutation();
  const navigation = useAppNavigation();
  const loading = coupleQuery.isPending
    || Boolean(coupleData && anniversariesQuery.isPending);
  let contentProps: HomePageContentProps | null = null;

  if (user && coupleData) {
    contentProps = {
      user,
      coupleData,
      anniversaries: anniversariesQuery.data || [],
      addPartnerLoading: invitePartner.isPending,
      addAnniversaryLoading: addAnniversary.isPending,
      blockingMessage: getBlockingMessage(
        addAnniversary.isPending,
        invitePartner.isPending,
        leaveCouple.isPending,
        updateBackground.isPending,
      ),
      onAddPartner: () => invitePartner.mutateAsync(),
      onAddAnniversary: (draft) => addAnniversary.mutateAsync(draft),
      onEditProfile: navigation.goEdit,
      onUpdateBackground: async (url) => {
        await updateBackground.mutateAsync(url);
      },
    };
  }

  return { contentProps, loading };
}

function getBlockingMessage(
  isAddingAnniversary: boolean,
  isInvitingPartner: boolean,
  isLeavingCouple: boolean,
  isUpdatingBackground: boolean,
) {
  if (isAddingAnniversary) return "Äang lÆ°u ngÃ y ká»· niá»‡m...";
  if (isInvitingPartner) return "Äang má»i ngÆ°á»i áº¥y...";
  if (isLeavingCouple) return "Äang rá»i khÃ´ng gian...";
  if (isUpdatingBackground) return "Äang cáº­p nháº­t áº£nh ná»n...";

  return null;
}
