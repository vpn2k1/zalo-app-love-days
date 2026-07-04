import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSnackbar } from "@/components/zaui";
import { anniversaryService } from "@/services/anniversaryService";
import type { AnniversaryDraft } from "@/types/anniversary";
import type { CoupleWithMembers } from "@/types/couple";
import type { AppUser } from "@/types/user";
import { anniversariesQueryKey } from "@/config/queryKeys";

type Input = {
  coupleData: CoupleWithMembers | null;
  user: AppUser | null;
};

export function useAnniversaryMutation({ coupleData, user }: Input) {
  const queryClient = useQueryClient();
  const snackbar = useAppSnackbar();

  return useMutation({
    mutationFn: async (draft: AnniversaryDraft) => {
      if (!user || !coupleData) throw new Error("Bạn cần cấp quyền Zalo trước.");
      return anniversaryService.create(coupleData.couple.id, user.id, draft);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: anniversariesQueryKey(coupleData?.couple.id),
      });
    },
    onError: (error) => {
      console.error(error);
      let message = "Không thể thêm ngày kỷ niệm. Vui lòng thử lại.";
      if (error instanceof Error) message = error.message;
      snackbar.showError(message);
    },
  });
}
