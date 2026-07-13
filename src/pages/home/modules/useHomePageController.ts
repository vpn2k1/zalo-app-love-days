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
  const { currentUserQuery, user } = useCurrentUser();
  const { coupleData, coupleQuery } = useCoupleData();
  const { anniversaries, anniversariesQuery } = useAnniversariesData(
    coupleData?.couple.id || "",
  );
  const addAnniversary = useAnniversaryMutation();
  const invitePartner = useInvitePartnerMutation();
  const leaveCouple = useLeaveCoupleMutation();
  const updateBackground = useUpdateBackgroundMutation();
  const navigation = useAppNavigation();
  const loading = coupleQuery.isPending
    || Boolean(coupleData && anniversariesQuery.isPending);
  const refreshing = currentUserQuery.isRefetching
    || coupleQuery.isRefetching
    || anniversariesQuery.isRefetching;
  let contentProps: HomePageContentProps | null = null;

  const refreshHome = async () => {
    const refreshedUser = await currentUserQuery.refetch();
    if (!refreshedUser.data) {
      navigation.goPermission({ replace: true });
      return;
    }

    await coupleQuery.refetch();
    await anniversariesQuery.refetch();
  };

  if (user && coupleData) {
    contentProps = {
      user,
      coupleData,
      anniversaries,
      addPartnerLoading: invitePartner.isPending,
      addAnniversaryLoading: addAnniversary.isPending,
      refreshing,
      blockingMessage: getBlockingMessage(
        addAnniversary.isPending,
        invitePartner.isPending,
        leaveCouple.isPending,
        updateBackground.isPending,
      ),
      onAddPartner: () => invitePartner.mutateAsync(),
      onAddAnniversary: (draft) => addAnniversary.mutateAsync(draft),
      onEditProfile: navigation.goEdit,
      onRefresh: refreshHome,
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
  if (isAddingAnniversary) return "Đang lưu ngày kỷ niệm...";
  if (isInvitingPartner) return "Đang mời người ấy...";
  if (isLeavingCouple) return "Đang rời không gian...";
  if (isUpdatingBackground) return "Đang cập nhật ảnh nền...";
  return null;
}
