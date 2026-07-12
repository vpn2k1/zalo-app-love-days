import type { QueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAppSnackbar } from "@/components/zaui";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useCurrentUserActions } from "@/hooks/useCurrentUser";
import { authService } from "@/services/authService";
import { coupleDisplayService } from "@/services/coupleDisplayService";
import { coupleService } from "@/services/coupleService";
import { leaveSpaceService } from "@/services/leaveSpaceService";
import { mediaService } from "@/services/mediaService";
import type { CoupleWithMembers } from "@/types/couple";
import type { AppUser } from "@/types/user";
import { anniversariesQueryKey, coupleQueryKey, currentUserQueryKey } from "@/config/queryKeys";

type Input = {
  coupleData: CoupleWithMembers | null;
  queryClient: QueryClient;
  user: AppUser | null;
};

export function useProfileMutations({
  coupleData,
  queryClient,
  user,
}: Input) {
  const snackbar = useAppSnackbar();
  const { setUser } = useCurrentUserActions();
  const navigation = useAppNavigation();
  const saveProfileMutation = useMutation({
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
      snackbar.showError(getErrorMessage(
        error,
        "Không thể lưu hồ sơ. Vui lòng thử lại.",
      ));
    },
  });

  const updateStartDateMutation = useMutation({
    mutationFn: async (startDate: string) => {
      if (!coupleData) throw new Error("Không tìm thấy.");
      return coupleService.updateCoupleStartDate(coupleData.couple.id, startDate);
    },
    onSuccess: async () => {
      if (!user) return;
      await queryClient.invalidateQueries({ queryKey: coupleQueryKey(user.id) });
    },
    onError: (error) => {
      console.error(error);
      snackbar.showError(getErrorMessage(
        error,
        "Không thể cập nhật ngày bắt đầu. Vui lòng thử lại.",
      ));
    },
  });

  const updateBackgroundMutation = useMutation({
    mutationFn: async (backgroundUrl: string | null) => {
      if (!coupleData) throw new Error("Không tìm thấy.");
      const savedUrl = await mediaService.uploadImagePath({
        coupleId: coupleData.couple.id,
        fileName: "background",
        path: backgroundUrl,
        scope: "backgrounds",
      });
      return coupleDisplayService.updateBackground(coupleData.couple.id, savedUrl);
    },
    onSuccess: async () => {
      if (!user) return;
      await queryClient.invalidateQueries({ queryKey: coupleQueryKey(user.id) });
    },
    onError: (error) => {
      console.error(error);
      snackbar.showError(getErrorMessage(
        error,
        "Không thể cập nhật ảnh nền. Vui lòng thử lại.",
      ));
    },
  });

  const leaveCoupleMutation = useMutation({
    mutationFn: async () => {
      if (!coupleData || !user) throw new Error("Không tìm thấy.");
      await leaveSpaceService.leave({ coupleData, user });
    },
    onSuccess: async () => {
      if (!user) return;
      await queryClient.invalidateQueries({ queryKey: coupleQueryKey(user.id) });
      queryClient.removeQueries({
        queryKey: anniversariesQueryKey(coupleData?.couple.id),
      });
      queryClient.setQueryData(currentUserQueryKey(), null);
      navigation.goPermission({ replace: true });
    },
    onError: (error) => {
      console.error(error);
      snackbar.showError(getErrorMessage(
        error,
        "Không thể rời khỏi. Vui lòng thử lại.",
      ));
    },
  });

  return {
    leaveCoupleMutation,
    saveProfileMutation,
    updateBackgroundMutation,
    updateStartDateMutation,
  };
}

type ProfilePayload = { display_name: string; custom_avatar_url: string | null };

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message;

  return fallback;
}

function updateCoupleUserCache(queryClient: QueryClient, updatedUser: AppUser) {
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
