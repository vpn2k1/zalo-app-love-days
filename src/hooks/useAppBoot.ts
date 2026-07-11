import { useEffect, useMemo, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import {
  restoreCurrentUser,
  setCurrentUserCache,
} from "@/hooks/useCurrentUser";
import { coupleService } from "@/services/coupleService";
import { anniversaryService } from "@/services/anniversaryService";
import { anniversariesQueryKey, coupleQueryKey } from "@/config/queryKeys";
import { getInviteCodeFromUrl } from "@/utils/invite";
import type { AppUser } from "@/types/user";
import type { QueryClient } from "@tanstack/react-query";

async function resolveSpaceAfterBoot(
  appUser: AppUser,
  queryClient: QueryClient,
  navigation: ReturnType<typeof useAppNavigation>,
) {
  setCurrentUserCache(queryClient, appUser);
  const coupleData = await coupleService.getCoupleByUser(appUser.id);
  queryClient.setQueryData(coupleQueryKey(appUser.id), coupleData);
  if (!coupleData) {
    navigation.goPermission({ replace: true });
    return;
  }

  const coupleId = coupleData.couple.id;
  await queryClient.prefetchQuery({
    queryKey: anniversariesQueryKey(coupleId),
    queryFn: () => anniversaryService.list(coupleId),
  });
  navigation.goHome({ replace: true });
}

export function useAppBoot() {
  const queryClient = useQueryClient();
  const bootedRef = useRef(false);
  const inviteCode = useMemo(getInviteCodeFromUrl, []);
  const navigation = useAppNavigation();

  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;

    if (inviteCode) {
      restoreCurrentUser()
        .then((user) => {
          if (user) setCurrentUserCache(queryClient, user);
        })
        .catch(() => undefined)
        .then(() => {
          navigation.goInvite({ replace: true });
        });
      return;
    }

    restoreCurrentUser()
      .then((user) => {
        if (!user) {
          navigation.goPermission({ replace: true });
          return;
        }
        return resolveSpaceAfterBoot(user, queryClient, navigation);
      })
      .catch(() => {
        navigation.goPermission({ replace: true });
      });
  }, [inviteCode, navigation, queryClient]);
}
