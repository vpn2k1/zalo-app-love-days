import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWatch } from "react-hook-form";

import { useAppSnackbar } from "@/components/zaui";
import {
  allAnniversariesQueryKey,
  anniversariesByDateQueryKey,
  infiniteAnniversariesQueryKey,
} from "@/config/queryKeys";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { anniversaryService } from "@/services/anniversaryService";
import { currentUserStore } from "@/services/currentUserStore";

export function useMemoryDetailDelete() {
  const queryClient = useQueryClient();
  const snackbar = useAppSnackbar();
  const navigation = useAppNavigation();
  const coupleId = useWatch({ name: "couple_id", exact: true });
  const id = useWatch({ name: "id", exact: true });

  return useMutation({
    mutationFn: async () => {
      const user = currentUserStore.get();
      if (!coupleId || !id || !user?.id) {
        throw new Error("Không tìm thấy kỷ niệm.");
      }

      return anniversaryService.remove(coupleId, id, user.id);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: allAnniversariesQueryKey(coupleId),
        }),
        queryClient.invalidateQueries({
          queryKey: anniversariesByDateQueryKey(coupleId),
        }),
        queryClient.invalidateQueries({
          queryKey: infiniteAnniversariesQueryKey(coupleId),
        }),
        queryClient.invalidateQueries({ queryKey: ["get-memory"] }),
        queryClient.invalidateQueries({ queryKey: ["memory"] }),
      ]);
      snackbar.showSuccess("Đã xoá kỷ niệm.");
      navigation.goBack();
    },
    onError: (error) => {
      console.error(error);
      let message = "Không thể xoá kỷ niệm. Vui lòng thử lại.";
      if (error instanceof Error) message = error.message;
      snackbar.showError(message);
    },
  });
}
