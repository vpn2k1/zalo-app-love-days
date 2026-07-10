import {
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { currentUserQueryKey } from "@/config/queryKeys";
import { authService } from "@/services/authService";
import { zaloService } from "@/services/zaloService";
import type { AppUser, ZaloUserProfile } from "@/types/user";

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

  return {
    currentUserQuery,
    getUser: () => getCurrentUserCache(queryClient),
    setUser: (user: AppUser) => setCurrentUserCache(queryClient, user),
    updateUser: (updater: UpdateCurrentUser) => updateCurrentUserCache(queryClient, updater),
    user: currentUserQuery.data ?? null,
  };
}

export function useCurrentUserActions() {
  const queryClient = useQueryClient();

  return {
    getUser: () => getCurrentUserCache(queryClient),
    setUser: (user: AppUser) => setCurrentUserCache(queryClient, user),
    updateUser: (updater: UpdateCurrentUser) => updateCurrentUserCache(queryClient, updater),
  };
}

const DEFAULT_USER_NAME = "Người dùng Zalo";

export async function authorizeCurrentUser() {
  const zaloProfile = await authorizeZaloUserProfile();
  return authService.upsertZaloUser(zaloProfile);
}

export async function authorizePendingCurrentUser(): Promise<AppUser> {
  const profile = await authorizeZaloUserProfile();
  return {
    id: "",
    zalo_user_id: profile.id,
    name: profile.name,
    avatar_url: profile.avatar,
    display_name: profile.name,
  };
}

async function authorizeZaloUserProfile(): Promise<ZaloUserProfile> {
  try {
    await zaloService.requestUserInfoPermission();
  } catch {
    return getDefaultZaloProfile();
  }

  const profile = await zaloService.tryGetUserProfile();
  if (!profile) return getDefaultZaloProfile();

  return profile;
}

export async function restoreCurrentUser(): Promise<AppUser | null> {
  const zaloUserId = await zaloService.getZaloUserId();
  return authService.findUserByZaloId(zaloUserId);
}

async function getDefaultZaloProfile(): Promise<ZaloUserProfile> {
  const zaloUserId = await zaloService.getZaloUserId();
  return {
    id: zaloUserId,
    name: DEFAULT_USER_NAME,
    avatar: undefined,
  };
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
