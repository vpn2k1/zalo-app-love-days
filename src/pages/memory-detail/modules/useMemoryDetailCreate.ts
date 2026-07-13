import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWatch } from "react-hook-form";

import { useAppSnackbar } from "@/components/zaui";
import {
  allAnniversariesQueryKey,
  infiniteAnniversariesQueryKey,
} from "@/config/queryKeys";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { anniversaryService } from "@/services/anniversaryService";
import { currentUserStore } from "@/services/currentUserStore";

import type { MemoryDetailFormValues } from "../types/MemoryDetailPageType";
import { normalizeMemoryDetailValues } from "./memoryDetailForm";

export function useMemoryDetailCreate() {
  const queryClient = useQueryClient();
  const snackbar = useAppSnackbar();
  const navigate = useAppNavigation();
  const coupleId = useWatch({ name: "couple_id", exact: true });

  return useMutation({
    mutationFn: (values: MemoryDetailFormValues) => {
      const user = currentUserStore.get();
      if (!user?.id || !coupleId) {
        throw new Error("Không tìm thấy thông tin của hai bạn.");
      }

      return anniversaryService.create(
        coupleId,
        user.id,
        normalizeMemoryDetailValues(values),
      );
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: allAnniversariesQueryKey(coupleId),
        }),
        queryClient.invalidateQueries({
          queryKey: infiniteAnniversariesQueryKey(coupleId),
        }),
      ]);
      navigate.goAnniversaries({ replace: true });
      snackbar.showSuccess("Đã tạo kỷ niệm.");
    },
    onError: (error) => {
      console.error(error);
      snackbar.showError("Không thể tạo kỷ niệm. Vui lòng thử lại.");
    },
  });
}
