import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSnackbar } from "@/components/zaui";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import {
  authorizeCurrentUser,
  setCurrentUserCache,
} from "@/hooks/useCurrentUser";
import { coupleService } from "@/services/coupleService";
import { currentUserStore } from "@/services/currentUserStore";
import { isInviteConflictMessage } from "@/services/inviteErrors";
import { inviteService } from "@/services/inviteService";
import type { CoupleWithMembers } from "@/types/couple";
import { getInviteCodeFromUrl } from "@/utils/invite";
import {
  allAnniversariesQueryKey,
  coupleQueryKey,
  infiniteAnniversariesQueryKey,
} from "@/config/queryKeys";
import type { AppUser } from "@/types/user";

export function useInviteAcceptance() {
  const [inviteConflict, setInviteConflict] = useState("");
  const snackbar = useAppSnackbar();
  const navigation = useAppNavigation();
  const queryClient = useQueryClient();
  const inviteCode = useMemo(getInviteCodeFromUrl, []);

  const acceptInviteMutation = useMutation({
    mutationFn: async () => {
      if (!inviteCode) throw new Error("Thiếu mã lời mời.");
      const appUser = await getSavedInviteUser(currentUserStore.get());
      setCurrentUserCache(queryClient, appUser);
      const existingCouple = await coupleService.getCoupleByUser(appUser.id);
      if (existingCouple) {
        queryClient.setQueryData(coupleQueryKey(appUser.id), existingCouple);
      }
      const accepted = await inviteService.acceptInvite(inviteCode, appUser);
      return { appUser, accepted };
    },
    onSuccess: async ({ appUser, accepted }) => {
      setCurrentUserCache(queryClient, appUser);
      setInviteConflict("");
      queryClient.setQueryData(coupleQueryKey(appUser.id), accepted);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: allAnniversariesQueryKey(accepted.couple.id),
        }),
        queryClient.invalidateQueries({
          queryKey: infiniteAnniversariesQueryKey(accepted.couple.id),
        }),
      ]);
      navigation.goHome({ replace: true });
    },
    onError: (error) => {
      console.error(error);
      let message = "Không thể nhận lời mời. Vui lòng thử lại.";
      if (error instanceof Error) message = error.message;
      if (isInviteConflictMessage(message)) {
        setInviteConflict(message);
        return;
      }
      snackbar.showError(message);
    },
  });

  const closeInviteConflict = async () => {
    setInviteConflict("");
    const user = currentUserStore.get();
    if (!user) {
      navigation.goPermission({ replace: true });
      return;
    }
    const data = queryClient.getQueryData<CoupleWithMembers>(coupleQueryKey(user.id))
      ?? await coupleService.getCoupleByUser(user.id);
    queryClient.setQueryData(coupleQueryKey(user.id), data);
    if (data) {
      navigation.goHome({ replace: true });
      return;
    }
    navigation.goPermission({ replace: true });
  };

  return { acceptInviteMutation, closeInviteConflict, inviteConflict };
}

function getSavedInviteUser(user: AppUser | null) {
  if (user?.id) return Promise.resolve(user);

  return authorizeCurrentUser();
}
