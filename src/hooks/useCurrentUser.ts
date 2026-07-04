import { useCallback } from "react";
import {
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { currentUserQueryKey } from "@/config/queryKeys";
import { authService } from "@/services/authService";
import { zaloService } from "@/services/zaloService";
import type { AppUser } from "@/types/user";

type Options = {
  restore?: boolean;
};

type UpdateCurrentUser = (current: AppUser) => AppUser;

export function useCurrentUser(options: Options = {}) {
  const queryClient = useQueryClient();
  const restore = getRestoreOption(options);
  const currentUserQuery = useQuery({
    queryKey: currentUserQueryKey(),
    queryFn: restoreCurrentUser,
    enabled: restore,
    retry: false,
  });
  const setUser = useCallback(
    (user: AppUser) => setCurrentUserCache(queryClient, user),
    [queryClient],
  );
  const getUser = useCallback(
    () => getCurrentUserCache(queryClient),
    [queryClient],
  );
  const updateUser = useCallback(
    (updater: UpdateCurrentUser) => {
      updateCurrentUserCache(queryClient, updater);
    },
    [queryClient],
  );

  return {
    currentUserQuery,
    getUser,
    setUser,
    updateUser,
    user: currentUserQuery.data ?? null,
  };
}

export async function authorizeCurrentUser() {
  await zaloService.requestUserInfoPermission();
  return restoreCurrentUser();
}

export async function restoreCurrentUser() {
  const zaloUser = await zaloService.getCurrentUser();
  return authService.upsertZaloUser(zaloUser);
}

export function setCurrentUserCache(
  queryClient: QueryClient,
  user: AppUser,
) {
  queryClient.setQueryData(currentUserQueryKey(), user);
}

export function getCurrentUserCache(queryClient: QueryClient) {
  return queryClient.getQueryData<AppUser>(currentUserQueryKey()) ?? null;
}

export function updateCurrentUserCache(
  queryClient: QueryClient,
  updater: UpdateCurrentUser,
) {
  queryClient.setQueryData<AppUser | null>(currentUserQueryKey(), (current) => {
    if (!current) return current;

    return updater(current);
  });
}

function getRestoreOption(options: Options) {
  if (!options.restore) return false;

  return true;
}
