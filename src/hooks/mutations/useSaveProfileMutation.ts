import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSnackbar } from "@/components/zaui";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useCoupleData } from "@/hooks/useCoupleData";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCurrentUserActions } from "@/hooks/useCurrentUser";
import { authService } from "@/services/authService";
import { mediaService } from "@/services/mediaService";
import type { CoupleWithMembers } from "@/types/couple";
import type { AppUser } from "@/types/user";
import { coupleQueryKey } from "@/config/queryKeys";

type ProfilePayload = {
  custom_avatar_url: string | null;
  display_name: string;
};

export function useSaveProfileMutation() {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();
  const { coupleData } = useCoupleData();
  const { setUser } = useCurrentUserActions();
  const snackbar = useAppSnackbar();
  const navigation = useAppNavigation();

  return useMutation({
    mutationFn: async (payload: ProfilePayload) => {
      if (!user || !coupleData) throw new Error("Bạn cần cấp quyền Zalo trước.");

      const customAvatarUrl = await mediaService.uploadImagePath({
        coupleId: coupleData.couple.id,
        fileName: `avatar-${user.id}`,
        path: payload.custom_avatar_url,
        scope: "avatars",
      });
      return authService.updateProfile(user.id, {
        display_name: payload.display_name,
        custom_avatar_url: customAvatarUrl,
      });
    },
    onMutate: async (payload) => {
      if (!user) throw new Error("Bạn cần cấp quyền Zalo trước.");
      await queryClient.cancelQueries({ queryKey: coupleQueryKey(user.id) });
      const previousUser = user;
      const previousCouple = queryClient.getQueryData<CoupleWithMembers>(
        coupleQueryKey(user.id),
      );
      const optimisticUser = {
        ...user,
        display_name: payload.display_name,
        custom_avatar_url: payload.custom_avatar_url,
      };
      setUser(optimisticUser);
      updateCoupleUserCache(queryClient, optimisticUser);
      return { previousCouple, previousUser };
    },
    onSuccess: async (updated) => {
      setUser(updated);
      updateCoupleUserCache(queryClient, updated);
      await queryClient.invalidateQueries({ queryKey: coupleQueryKey(updated.id) });
      navigation.goHome();
    },
    onError: (error, _payload, context) => {
      if (context) {
        setUser(context.previousUser);
        queryClient.setQueryData(
          coupleQueryKey(context.previousUser.id),
          context.previousCouple,
        );
      }
      snackbar.showError(getErrorMessage(error, "Không thể lưu hồ sơ. Vui lòng thử lại."));
    },
  });
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message;
  return fallback;
}

function updateCoupleUserCache(queryClient: ReturnType<typeof useQueryClient>, updatedUser: AppUser) {
  queryClient.setQueryData<CoupleWithMembers | null>(
    coupleQueryKey(updatedUser.id),
    (current) => {
      if (!current) return current;
      return {
        ...current,
        members: current.members.map((member) => {
          if (member.user_id !== updatedUser.id) return member;
          return { ...member, user: updatedUser };
        }),
      };
    },
  );
}
