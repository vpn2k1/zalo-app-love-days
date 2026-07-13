import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSnackbar } from "@/components/zaui";
import { useCoupleData } from "@/hooks/useCoupleData";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { coupleService } from "@/services/coupleService";
import { mediaService } from "@/services/mediaService";
import {
  allAnniversariesQueryKey,
  coupleQueryKey,
  infiniteAnniversariesQueryKey,
} from "@/config/queryKeys";

export type UpdateCouplePayload = {
  startDate?: string;
  backgroundUrl?: string | null;
};

export function useUpdateCoupleMutation() {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();
  const { coupleData } = useCoupleData();
  const snackbar = useAppSnackbar();

  return useMutation({
    mutationFn: async (payload: UpdateCouplePayload) => {
      if (!coupleData) throw new Error("Không tìm thấy.");

      const updatePayload: { startDate?: string; backgroundUrl?: string | null } = {};

      // Only upload background if backgroundUrl is provided and has changed
      if (payload.backgroundUrl !== undefined && payload.backgroundUrl !== coupleData.couple.background_url) {
        const savedUrl = await mediaService.uploadImagePath({
          coupleId: coupleData.couple.id,
          fileName: "background",
          path: payload.backgroundUrl,
          scope: "backgrounds",
        });
        updatePayload.backgroundUrl = savedUrl;
      }

      if (payload.startDate !== undefined && payload.startDate !== coupleData.couple.start_date) {
        updatePayload.startDate = payload.startDate;
      }

      // If nothing has changed, we don't need to call the server
      if (Object.keys(updatePayload).length === 0) {
        return coupleData.couple;
      }

      return coupleService.updateCouple(coupleData.couple.id, updatePayload);
    },
    onSuccess: async () => {
      if (!user) return;
      if (!coupleData) return;

      await queryClient.invalidateQueries({ queryKey: coupleQueryKey(user.id) });
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: allAnniversariesQueryKey(coupleData.couple.id),
        }),
        queryClient.invalidateQueries({
          queryKey: infiniteAnniversariesQueryKey(coupleData.couple.id),
        }),
      ]);
      await queryClient.invalidateQueries({ queryKey: ["memory"] });
    },
    onError: (error) => {
      console.error(error);
      let message = "Không thể cập nhật thông tin. Vui lòng thử lại.";
      if (error instanceof Error) message = error.message;
      snackbar.showError(message);
    },
  });
}
