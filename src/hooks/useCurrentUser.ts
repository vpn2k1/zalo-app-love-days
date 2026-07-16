import {
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { currentUserQueryKey } from "@/config/queryKeys";
import { authService } from "@/services/authService";
import {
  currentUserStore,
  type CurrentUserUpdater,
} from "@/services/currentUserStore";
import { zaloService } from "@/services/zaloService";
import type { AppUser, ZaloUserProfile } from "@/types/user";

type Options = {
  restore?: boolean;
};

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
    setUser: (user: AppUser | null) => setCurrentUserCache(queryClient, user),
    updateUser: (updater: CurrentUserUpdater) =>
      updateCurrentUserCache(queryClient, updater),
    user: currentUserQuery.data ?? null,
  };
}

export function useCurrentUserActions() {
  const queryClient = useQueryClient();

  return {
    getUser: () => getCurrentUserCache(queryClient),
    setUser: (user: AppUser | null) => setCurrentUserCache(queryClient, user),
    updateUser: (updater: CurrentUserUpdater) =>
      updateCurrentUserCache(queryClient, updater),
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

export async function createDefaultCurrentUser() {
  const profile = await getDefaultZaloProfile();
  const existingUser = await authService.findUserByZaloId(profile.id);
  if (existingUser) return existingUser;

  return authService.upsertZaloUser(profile);
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
  if (!zaloUserId) {
    currentUserStore.set(null);
    return null;
  }

  const user = await authService.findUserByZaloId(zaloUserId);
  currentUserStore.set(user);
  return user;
}

async function getDefaultZaloProfile(): Promise<ZaloUserProfile> {
  const zaloUserId = await zaloService.getZaloUserId();
  if (!zaloUserId) {
    throw new Error("Không thể lấy mã người dùng Zalo. Vui lòng mở trong Zalo để tiếp tục.");
  }

  return {
    id: zaloUserId,
    name: DEFAULT_USER_NAME,
    avatar: undefined,
  };
}

export function setCurrentUserCache(
  queryClient: QueryClient,
  user: AppUser | null,
) {
  currentUserStore.set(user);
  queryClient.setQueryData(currentUserQueryKey(), user);
}

export function getCurrentUserCache(queryClient: QueryClient) {
  const user = queryClient.getQueryData<AppUser>(currentUserQueryKey()) ?? null;
  currentUserStore.set(user);
  return user;
}

export function updateCurrentUserCache(
  queryClient: QueryClient,
  updater: CurrentUserUpdater,
) {
  const current = getCurrentUserCache(queryClient);
  if (!current) return;

  setCurrentUserCache(queryClient, updater(current));
}

function getRestoreOption(options: Options) {
  if (!options.restore) return false;

  return true;
}
