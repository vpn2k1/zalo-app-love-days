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

import type { MemoryDetailFormValues } from "../types/MemoryDetailPageType";
import { normalizeMemoryDetailValues } from "./memoryDetailForm";

export function useMemoryDetailUpdate() {
  const queryClient = useQueryClient();
  const snackbar = useAppSnackbar();
  const navigation = useAppNavigation();
  const coupleId = useWatch({ name: "couple_id", exact: true });
  const id = useWatch({ name: "id", exact: true });
  return useMutation({
    mutationFn: (values: MemoryDetailFormValues) => {
      if (!coupleId || !id) throw new Error("Không tìm thấy kỷ niệm.");

      return anniversaryService.update(
        coupleId,
        id,
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
        queryClient.invalidateQueries({
          queryKey: anniversariesByDateQueryKey(coupleId),
        }),
        queryClient.refetchQueries({
          queryKey: ["get-memory", coupleId, id],
        }),
      ]);
      navigation.goBack();
      snackbar.showSuccess("Đã cập nhật kỷ niệm.");
    },
    onError: (error) => {
      console.error(error);
      snackbar.showError("Không thể cập nhật. Vui lòng thử lại.");
    },
  });
}
