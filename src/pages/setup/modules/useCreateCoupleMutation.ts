import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSnackbar } from "@/components/zaui";
import { anniversariesQueryKey, coupleQueryKey } from "@/config/queryKeys";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useCurrentUserActions } from "@/hooks/useCurrentUser";
import { coupleService } from "@/services/coupleService";
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
    mutationFn: (input: SetupCoupleInput) => {
      if (!user) throw new Error("Bạn cần cấp quyền Zalo trước.");
      return coupleService.createCouple(user, input);
    },
    onSuccess: async (data, input) => {
      if (!user?.id) return;
      const owner = data.members.find(
        (member) => member.user_id === user?.id,
      )?.user;
      let nextUser: AppUser = { ...user, display_name: input.displayName };
      if (owner) nextUser = owner;
      setUser(nextUser);
      queryClient.setQueryData<CoupleWithMembers>(
        coupleQueryKey(user.id),
        data,
      );
      await queryClient.invalidateQueries({
        queryKey: anniversariesQueryKey(data.couple.id),
      });
      navigation.goHome({ replace: true });
    },
    onError: (error) => {
      console.error(error);
      let message = "Không thể tạo Yêu. Vui lòng thử lại.";
      if (error instanceof Error) message = error.message;
      snackbar.showError(message);
    },
  });

  return { createCoupleMutation };
}
