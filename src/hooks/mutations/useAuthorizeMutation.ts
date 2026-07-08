import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSnackbar } from "@/components/zaui";
import { coupleQueryKey } from "@/config/queryKeys";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { authorizeCurrentUser, useCurrentUser } from "@/hooks/useCurrentUser";
import { coupleService } from "@/services/coupleService";

export function useAuthorizeMutation() {
  const queryClient = useQueryClient();
  const { setUser } = useCurrentUser();
  const snackbar = useAppSnackbar();
  const navigation = useAppNavigation();

  return useMutation({
    mutationFn: async () => {
      const appUser = await authorizeCurrentUser();
      setUser(appUser);
      return appUser;
    },
    onSuccess: async (appUser) => {
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
        "Bạn cần cho phép lấy thông tin Zalo để thiết lập.",
      );
      navigation.goPermission({ replace: true });
    },
  });
}
