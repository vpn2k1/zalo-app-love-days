import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAppSnackbar } from "@/components/zaui";
import { anniversariesQueryKey } from "@/config/queryKeys";
import { anniversaryService } from "@/services/anniversaryService";
import type { Anniversary } from "@/types/anniversary";

import type { MemoryDetailFormValues } from "../types/MemoryDetailPageType";
import { normalizeMemoryDetailValues } from "./memoryDetailForm";

type Input = {
  coupleId: string;
  userId: string;
  onCreated: (memory: Anniversary) => void;
};

export function useMemoryDetailCreate({
  coupleId,
  userId,
  onCreated,
}: Input) {
  const queryClient = useQueryClient();
  const snackbar = useAppSnackbar();

  return useMutation({
    mutationFn: (values: MemoryDetailFormValues) =>
      anniversaryService.create(
        coupleId,
        userId,
        normalizeMemoryDetailValues(values),
      ),
    onSuccess: async (createdMemory) => {
      onCreated(createdMemory);
      await queryClient.invalidateQueries({
        queryKey: anniversariesQueryKey(coupleId),
      });
      snackbar.showSuccess("Đã tạo kỷ niệm.");
    },
    onError: (error) => {
      console.error(error);
      snackbar.showError("Không thể tạo kỷ niệm. Vui lòng thử lại.");
    },
  });
}
