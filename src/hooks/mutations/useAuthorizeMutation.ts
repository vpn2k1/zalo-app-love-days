import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSnackbar } from "@/components/zaui";
import { coupleQueryKey } from "@/config/queryKeys";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import {
  authorizePendingCurrentUser,
  createDefaultCurrentUser,
  setCurrentUserCache,
} from "@/hooks/useCurrentUser";
import { coupleService } from "@/services/coupleService";
import { currentUserStore } from "@/services/currentUserStore";
import type { AppUser } from "@/types/user";

export function useAuthorizeMutation() {
  const queryClient = useQueryClient();
  const snackbar = useAppSnackbar();
  const navigation = useAppNavigation();

  return useMutation({
    mutationFn: async () => {
      const pendingUser = await authorizePendingCurrentUser();
      const appUser = mergeAuthorizedUser(currentUserStore.get(), pendingUser);
      setCurrentUserCache(queryClient, appUser);
      return appUser;
    },
    onSuccess: async (appUser) => {
      if (!appUser.id) {
        navigation.goSetup({ replace: true });
        return;
      }
      const data = await coupleService.getCoupleByUser(appUser.id);
      queryClient.setQueryData(coupleQueryKey(appUser.id), data);
      if (!data) {
        navigation.goSetup({ replace: true });
        return;
      }
      navigation.goHome({ replace: true });
    },
    onError: (error) => {
      console.error(error);
      snackbar.showError(
        "Không thể kết nối. Vui lòng thử lại.",
      );
    },
  });
}

export function useSkipAuthorizeMutation() {
  const queryClient = useQueryClient();
  const snackbar = useAppSnackbar();
  const navigation = useAppNavigation();

  return useMutation({
    mutationFn: async () => {
      const appUser = await createDefaultCurrentUser();
      setCurrentUserCache(queryClient, appUser);
      return appUser;
    },
    onSuccess: () => {
      navigation.goSetup({ replace: true });
    },
    onError: (error) => {
      console.error(error);
      snackbar.showError(
        "Không thể tiếp tục. Vui lòng thử lại.",
      );
    },
  });
}

function mergeAuthorizedUser(
  currentUser: AppUser | null,
  pendingUser: AppUser,
) {
  if (!currentUser?.id) return pendingUser;

  return {
    ...currentUser,
    name: pendingUser.name,
    avatar_url: pendingUser.avatar_url,
    display_name: currentUser.display_name || pendingUser.display_name,
  };
}
