import { useMutation, type QueryClient } from "@tanstack/react-query";
import { useAppSnackbar } from "@/components/zaui";
import { useCurrentUserActions } from "@/hooks/useCurrentUser";
import { coupleService } from "@/services/coupleService";
import { inviteService } from "@/services/inviteService";
import type { CoupleWithMembers } from "@/types/couple";
import type { AppUser } from "@/types/user";
import { anniversariesQueryKey, coupleQueryKey } from "@/config/queryKeys";
import { setHomeViewState } from "@/hooks/useHomeViewState";

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
      setHomeViewState("home");
    },
    onError: (error) => {
      console.error(error);
      let message = "Không thể nhận lời mời. Vui lòng thử lại.";
      if (error instanceof Error) message = error.message;
      if (message.includes("Bạn đã ghép nối")) {
        setInviteConflict(message);
        return;
      }
      snackbar.showError(message);
    },
  });

  const closeInviteConflict = async () => {
    setInviteConflict("");
    if (!user) {
      setHomeViewState("permission");
      return;
    }
    const data = queryClient.getQueryData<CoupleWithMembers>(coupleQueryKey(user.id))
      ?? await coupleService.getCoupleByUser(user.id);
    queryClient.setQueryData(coupleQueryKey(user.id), data);
    if (data) {
      setHomeViewState("home");
      return;
    }
    setHomeViewState("permission");
  };

  return { acceptInviteMutation, closeInviteConflict };
}
