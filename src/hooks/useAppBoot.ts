import { useEffect, useMemo, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { coupleService } from "@/services/coupleService";
import { coupleQueryKey } from "@/config/queryKeys";
import { getInviteCodeFromUrl } from "@/utils/invite";
import type { AppUser } from "@/types/user";
import type { QueryClient } from "@tanstack/react-query";

async function resolveSpaceAfterBoot(
  appUser: AppUser,
  setUser: (u: AppUser) => void,
  queryClient: QueryClient,
  navigation: ReturnType<typeof useAppNavigation>,
) {
  setUser(appUser);
  const data = await coupleService.getCoupleByUser(appUser.id);
  queryClient.setQueryData(coupleQueryKey(appUser.id), data);
  if (!data) {
    navigation.goSetup({ replace: true });
    return;
  }
  navigation.goHome({ replace: true });
}

export function useAppBoot() {
  const queryClient = useQueryClient();
  const bootedRef = useRef(false);
  const inviteCode = useMemo(getInviteCodeFromUrl, []);
  const currentUser = useCurrentUser();
  const { refetch } = currentUser.currentUserQuery;
  const { setUser } = currentUser;
  const navigation = useAppNavigation();

  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;

    if (inviteCode) {
      refetch()
        .then((result) => {
          if (result.data) setUser(result.data);
        })
        .catch(() => undefined)
        .then(() => {
          navigation.goInvite({ replace: true });
        });
      return;
    }

    refetch()
      .then((result) => {
        if (!result.data) {
          throw new Error("Không thể khôi phục thông tin Zalo.");
        }
        return resolveSpaceAfterBoot(result.data, setUser, queryClient, navigation);
      })
      .catch(() => {
        navigation.goPermission({ replace: true });
      });
  }, [inviteCode, navigation, queryClient, refetch, setUser]);
}
