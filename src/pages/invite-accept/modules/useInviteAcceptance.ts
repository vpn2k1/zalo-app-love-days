import { useMutation, type QueryClient } from "@tanstack/react-query";
import { useAppSnackbar } from "@/components/zaui";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useCurrentUserActions } from "@/hooks/useCurrentUser";
import { coupleService } from "@/services/coupleService";
import { isInviteConflictMessage } from "@/services/inviteErrors";
import { inviteService } from "@/services/inviteService";
import type { CoupleWithMembers } from "@/types/couple";
import type { AppUser } from "@/types/user";
import { anniversariesQueryKey, coupleQueryKey } from "@/config/queryKeys";

type Input = {
  authorizeUser: () => Promise<AppUser>;
  inviteCode: string | null;
  queryClient: QueryClient;
  setInviteConflict: (value: string) => void;
  user: AppUser | null;
};

export function useInviteAcceptance({
  authorizeUser,
  inviteCode,
  queryClient,
  setInviteConflict,
  user,
}: Input) {
  const snackbar = useAppSnackbar();
  const { setUser } = useCurrentUserActions();
  const navigation = useAppNavigation();
  const acceptInviteMutation = useMutation({
    mutationFn: async () => {
      if (!inviteCode) throw new Error("Thiếu mã lời mời.");
      const appUser = user ?? (await authorizeUser());
      setUser(appUser);
      const existingCouple = await coupleService.getCoupleByUser(appUser.id);
      if (existingCouple) {
        queryClient.setQueryData(coupleQueryKey(appUser.id), existingCouple);
      }
      const accepted = await inviteService.acceptInvite(inviteCode, appUser);
      return { appUser, accepted };
    },
    onSuccess: async ({ appUser, accepted }) => {
      setUser(appUser);
      setInviteConflict("");
      queryClient.setQueryData(coupleQueryKey(appUser.id), accepted);
      await queryClient.invalidateQueries({
        queryKey: anniversariesQueryKey(accepted.couple.id),
      });
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

  return { acceptInviteMutation, closeInviteConflict };
}
