import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSnackbar } from "@/components/zaui";
import {
  allAnniversariesQueryKey,
  coupleQueryKey,
  infiniteAnniversariesQueryKey,
} from "@/config/queryKeys";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useCurrentUserActions } from "@/hooks/useCurrentUser";
import { authService } from "@/services/authService";
import { coupleService } from "@/services/coupleService";
import { inviteService } from "@/services/inviteService";
import type { CoupleWithMembers, SetupCoupleInput } from "@/types/couple";
import type { AppUser } from "@/types/user";

type Input = {
  user: AppUser | null;
};

export function useCreateCoupleMutation({ user }: Input) {
  const queryClient = useQueryClient();
  const snackbar = useAppSnackbar();
  const { setUser } = useCurrentUserActions();
  const navigation = useAppNavigation();
  const createCoupleMutation = useMutation({
    mutationKey: ["createCouple"],
    mutationFn: async (input: SetupCoupleInput) => {
      if (!user) throw new Error("Bạn cần cấp quyền Zalo trước.");
      const appUser = await ensureSavedUser(user);
      const coupleData = await coupleService.createCouple(appUser, input);
      await inviteService.createInvite(coupleData.couple.id, appUser.id);
      return { appUser, coupleData };
    },
    onSuccess: async ({ appUser, coupleData }, input) => {
      const owner = coupleData.members.find(
        (member) => member.user_id === appUser.id,
      )?.user;
      let nextUser: AppUser = { ...appUser, display_name: input.displayName };
      if (owner) nextUser = owner;
      setUser(nextUser);
      queryClient.setQueryData<CoupleWithMembers>(
        coupleQueryKey(appUser.id),
        coupleData,
      );
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: allAnniversariesQueryKey(coupleData.couple.id),
        }),
        queryClient.invalidateQueries({
          queryKey: infiniteAnniversariesQueryKey(coupleData.couple.id),
        }),
      ]);
      navigation.goHome({ replace: true });
    },
    onError: (error) => {
      console.error(error);
      let message = "Không thể tạo Nhật Ký Yêu. Vui lòng thử lại.";
      if (error instanceof Error) message = error.message;
      snackbar.showError(message);
    },
  });

  return { createCoupleMutation };
}

function ensureSavedUser(user: AppUser) {
  return authService.upsertZaloUser({
    id: user.zalo_user_id,
    name: user.name,
    avatar: user.avatar_url || undefined,
  });
}
