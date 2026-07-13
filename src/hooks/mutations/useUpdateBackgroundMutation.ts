import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSnackbar } from "@/components/zaui";
import { useCoupleData } from "@/hooks/useCoupleData";
import { coupleDisplayService } from "@/services/coupleDisplayService";
import { currentUserStore } from "@/services/currentUserStore";
import { mediaService } from "@/services/mediaService";
import { coupleQueryKey } from "@/config/queryKeys";

export function useUpdateBackgroundMutation() {
  const queryClient = useQueryClient();
  const { coupleData } = useCoupleData();
  const snackbar = useAppSnackbar();

  return useMutation({
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
      const user = currentUserStore.get();
      if (!user) return;
      await queryClient.invalidateQueries({ queryKey: coupleQueryKey(user.id) });
    },
    onError: (error) => {
      console.error(error);
      let message = "Không thể cập nhật ảnh nền. Vui lòng thử lại.";
      if (error instanceof Error) message = error.message;
      snackbar.showError(message);
    },
  });
}
