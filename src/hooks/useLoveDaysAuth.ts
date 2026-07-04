import { useCallback, useEffect, useMemo } from "react";
import { useMutation, type QueryClient } from "@tanstack/react-query";
import { useAppSnackbar } from "@/components/zaui";
import { coupleQueryKey } from "@/config/queryKeys";
import {
  authorizeCurrentUser,
  setCurrentUserCache,
  useCurrentUser,
} from "@/hooks/useCurrentUser";
import { coupleService } from "@/services/coupleService";
import type { AppUser } from "@/types/user";
import { getInviteCodeFromUrl } from "@/utils/invite";
import { setHomeViewState } from "./useHomeViewState";

type Input = {
  queryClient: QueryClient;
};

export function useLoveDaysAuth({ queryClient }: Input) {
  const inviteCode = useMemo(getInviteCodeFromUrl, []);
  const currentUser = useCurrentUser();
  const { refetch } = currentUser.currentUserQuery;
  const snackbar = useAppSnackbar();

  const openAfterAuth = useCallback(
    async (appUser: AppUser) => {
      setCurrentUserCache(queryClient, appUser);
      const data = await coupleService.getCoupleByUser(appUser.id);
      queryClient.setQueryData(coupleQueryKey(appUser.id), data);
      if (!data) {
        setHomeViewState("setup");
        return;
      }
      setHomeViewState("home");
    },
    [queryClient],
  );

  const authorizeUser = useCallback(async () => {
    const appUser = await authorizeCurrentUser();
    setCurrentUserCache(queryClient, appUser);
    return appUser;
  }, [queryClient]);

  useEffect(() => {
    if (inviteCode) {
      setHomeViewState("invite");
      return;
    }

    refetch()
      .then((result) => {
        if (!result.data) throw new Error("Không thể khôi phục thông tin Zalo.");

        return openAfterAuth(result.data);
      })
      .catch(() => {
        setHomeViewState("permission");
      });
  }, [inviteCode, openAfterAuth, refetch]);

  const authorizeMutation = useMutation({
    mutationFn: authorizeUser,
    onSuccess: async (appUser) => {
      await openAfterAuth(appUser);
    },
    onError: (error) => {
      console.error(error);
      snackbar.showError(
        "Bạn cần cho phép lấy thông tin Zalo để thiết lập Love Days.",
      );
      setHomeViewState("permission");
    },
  });

  return {
    authorizeMutation,
    authorizeUser,
    inviteCode,
    user: currentUser.user,
  };
}
