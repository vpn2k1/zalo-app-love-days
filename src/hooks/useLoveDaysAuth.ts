import { useCallback, useEffect, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSnackbar } from "@/components/zaui";
import { coupleQueryKey } from "@/config/queryKeys";
import { authorizeCurrentUser, useCurrentUser } from "@/hooks/useCurrentUser";
import { coupleService } from "@/services/coupleService";
import type { AppUser } from "@/types/user";
import { getInviteCodeFromUrl } from "@/utils/invite";
import { setHomeViewState } from "./useHomeViewState";

export function useLoveDaysAuth() {
  const queryClient = useQueryClient();
  const inviteCode = useMemo(getInviteCodeFromUrl, []);
  const currentUser = useCurrentUser();
  const { refetch } = currentUser.currentUserQuery;
  const { setUser } = currentUser;
  const snackbar = useAppSnackbar();

  const getCoupleAfterAuth = useCallback(
    async (appUser: AppUser) => {
      setUser(appUser);
      const data = await coupleService.getCoupleByUser(appUser.id);
      queryClient.setQueryData(coupleQueryKey(appUser.id), data);
      return data;
    },
    [queryClient, setUser],
  );

  const openExistingSpace = useCallback(
    async (appUser: AppUser) => {
      const data = await getCoupleAfterAuth(appUser);
      if (!data) {
        setHomeViewState("permission");
        return;
      }
      setHomeViewState("home");
    },
    [getCoupleAfterAuth],
  );

  const openAfterPermission = useCallback(
    async (appUser: AppUser) => {
      const data = await getCoupleAfterAuth(appUser);
      if (!data) {
        setHomeViewState("setup");
        return;
      }
      setHomeViewState("home");
    },
    [getCoupleAfterAuth],
  );

  const authorizeUser = useCallback(async () => {
    const appUser = await authorizeCurrentUser();
    setUser(appUser);
    return appUser;
  }, [setUser]);

  useEffect(() => {
    if (inviteCode) {
      setHomeViewState("invite");
      return;
    }

    refetch()
      .then((result) => {
        if (!result.data) {
          throw new Error("Không thể khôi phục thông tin Zalo.");
        }

        return openExistingSpace(result.data);
      })
      .catch(() => {
        setHomeViewState("permission");
      });
  }, [inviteCode, openExistingSpace, refetch]);

  const authorizeMutation = useMutation({
    mutationFn: authorizeUser,
    onSuccess: async (appUser) => {
      await openAfterPermission(appUser);
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
