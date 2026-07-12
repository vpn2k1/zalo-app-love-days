import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSnackbar } from "@/components/zaui";
import { anniversariesQueryKey } from "@/config/queryKeys";
import { anniversaryService } from "@/services/anniversaryService";
import type { Anniversary } from "@/types/anniversary";
import type { MemoryDetailFormValues } from "../types/MemoryDetailPageType";
import { normalizeMemoryDetailValues } from "./memoryDetailForm";
import { useAppNavigation } from "@/hooks/useAppNavigation";

type Input = {
  coupleId: string;
  memory: Anniversary;
  onUpdated: (memory: Anniversary) => void;
};

export function useMemoryDetailUpdate({ coupleId, memory, onUpdated }: Input) {
  const queryClient = useQueryClient();
  const snackbar = useAppSnackbar();
  const navigation = useAppNavigation();

  return useMutation({
    mutationFn: (values: MemoryDetailFormValues) =>
      anniversaryService.update(
        coupleId,
        memory.id,
        normalizeMemoryDetailValues(values),
      ),
    onSuccess: async (updatedMemory) => {
      onUpdated(updatedMemory);
      await queryClient.invalidateQueries({
        queryKey: anniversariesQueryKey(coupleId),
      });
      navigation.goAnniversaries({ replace: true });
      snackbar.showSuccess("Đã cập nhật kỷ niệm.");
    },
    onError: (error) => {
      console.error(error);
      snackbar.showError("Không thể cập nhật. Vui lòng thử lại.");
    },
  });
}
