import { useMutation } from "@tanstack/react-query";
import { useAppSnackbar } from "@/components/zaui";
import { inviteService } from "@/services/inviteService";
import type { CoupleWithMembers } from "@/types/couple";
import type { AppUser } from "@/types/user";

type Input = {
  coupleData: CoupleWithMembers | null;
  user: AppUser | null;
};

export function useInvitePartnerMutation({ coupleData, user }: Input) {
  const snackbar = useAppSnackbar();

  const invitePartnerMutation = useMutation({
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
      let feedback = "Đã mở chia sẻ lời mời.";
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

  return { invitePartnerMutation };
}
