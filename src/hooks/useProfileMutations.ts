import type { QueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { coupleService } from "@/services/coupleService";
import { mediaService } from "@/services/mediaService";
import type { CoupleWithMembers } from "@/types/couple";
import type { AppUser } from "@/types/user";
import type { AppView } from "./useLoveDaysController";

type Input = {
  coupleData: CoupleWithMembers | null;
  queryClient: QueryClient;
  setUser: (user: AppUser) => void;
  setView: (view: AppView) => void;
  user: AppUser | null;
};

export function useProfileMutations({
  coupleData,
  queryClient,
  setUser,
  setView,
  user,
}: Input) {
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
    onSuccess: async (updated) => {
      setUser(updated);
      await queryClient.invalidateQueries({ queryKey: coupleQueryKey(updated.id) });
      setView("home");
    },
  });

  const updateStartDateMutation = useMutation({
    mutationFn: async (startDate: string) => {
      if (!coupleData) throw new Error("Không tìm thấy Love Days.");
      return coupleService.updateCoupleStartDate(coupleData.couple.id, startDate);
    },
    onSuccess: async () => {
      if (!user) return;
      await queryClient.invalidateQueries({ queryKey: coupleQueryKey(user.id) });
    },
  });

  const leaveCoupleMutation = useMutation({
    mutationFn: async () => {
      if (!coupleData) throw new Error("Không tìm thấy Love Days.");
      await coupleService.leaveCouple(coupleData.couple.id);
    },
    onSuccess: async () => {
      if (!user) return;
      await queryClient.invalidateQueries({ queryKey: coupleQueryKey(user.id) });
      queryClient.removeQueries({
        queryKey: anniversariesQueryKey(coupleData?.couple.id),
      });
      setView("setup");
    },
  });

  return { leaveCoupleMutation, saveProfileMutation, updateStartDateMutation };
}

const coupleQueryKey = (userId?: string) => ["couple", userId] as const;
const anniversariesQueryKey = (coupleId?: string) =>
  ["anniversaries", coupleId] as const;

type ProfilePayload = { display_name: string; custom_avatar_url: string | null };
