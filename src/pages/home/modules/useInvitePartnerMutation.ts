import { useMutation } from "@tanstack/react-query";
import { useAppSnackbar } from "@/components/zaui";
import { useCoupleData } from "@/hooks/useCoupleData";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { inviteService } from "@/services/inviteService";

export function useInvitePartnerMutation() {
  const { user } = useCurrentUser();
  const { coupleData } = useCoupleData();
  const snackbar = useAppSnackbar();

  return useMutation({
    mutationFn: async () => {
      if (!user || !coupleData) {
        throw new Error("Bạn cần đăng nhập trước khi thêm đối tác.");
      }
      const invite = await inviteService.createInvite(coupleData.couple.id, user.id);
      return inviteService.shareInvite(
        invite.invite_code,
        user.custom_avatar_url || user.avatar_url || undefined,
      );
    },
    onSuccess: (result) => {
      let feedback = "Chia sẻ lời mời.";
      if (result.fallbackUsed) {
        feedback = "Không thể mở chia sẻ Zalo, liên kết mời đã được sao chép.";
      }
      snackbar.showSuccess(feedback);
    },
    onError: (error) => {
      console.error(error);
      let message = "Không thể tạo lời mời cho đối tác.";
      if (error instanceof Error) message = error.message;
      snackbar.showError(message);
    },
  });
}
