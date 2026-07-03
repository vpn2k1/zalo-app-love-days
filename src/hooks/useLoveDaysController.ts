import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { anniversaryService } from "@/services/anniversaryService";
import { authService } from "@/services/authService";
import { coupleService } from "@/services/coupleService";
import { inviteService } from "@/services/inviteService";
import { zaloService } from "@/services/zaloService";
import type { AnniversaryDraft } from "@/types/anniversary";
import type { CoupleWithMembers, SetupCoupleInput } from "@/types/couple";
import type { AppUser } from "@/types/user";
import { getInviteCodeFromUrl } from "@/utils/invite";
import { useProfileMutations } from "./useProfileMutations";

export type AppView = "permission" | "blocked" | "invite" | "setup" | "home" | "edit";

const coupleQueryKey = (userId?: string) => ["couple", userId] as const;
const anniversariesQueryKey = (coupleId?: string) =>
  ["anniversaries", coupleId] as const;

export function useLoveDaysController() {
  const queryClient = useQueryClient();
  const inviteCode = useMemo(getInviteCodeFromUrl, []);
  const [view, setView] = useState<AppView>(inviteCode ? "invite" : "permission");
  const [user, setUser] = useState<AppUser | null>(null);
  const [inviteError, setInviteError] = useState("");
  const [inviteFeedback, setInviteFeedback] = useState("");
  const [permissionError, setPermissionError] = useState("");
  const [setupError, setSetupError] = useState("");

  const coupleQuery = useQuery({
    queryKey: coupleQueryKey(user?.id),
    queryFn: () => coupleService.getCoupleByUser(user!.id),
    enabled: Boolean(user),
  });
  const coupleData = coupleQuery.data ?? null;
  const anniversariesQuery = useQuery({
    queryKey: anniversariesQueryKey(coupleData?.couple.id),
    queryFn: () => coupleService.getAnniversaries(coupleData!.couple.id),
    enabled: Boolean(coupleData),
  });

  const authorizeUser = async () => {
    await zaloService.requestUserInfoPermission();
    const zaloUser = await zaloService.getCurrentUser();
    return authService.upsertZaloUser(zaloUser);
  };

  const openAfterAuth = async (appUser: AppUser) => {
    setUser(appUser);
    const data = await coupleService.getCoupleByUser(appUser.id);
    queryClient.setQueryData(coupleQueryKey(appUser.id), data);
    setView(data ? "home" : "setup");
  };

  const authorizeMutation = useMutation({
    mutationFn: authorizeUser,
    onSuccess: async (appUser) => {
      setPermissionError("");
      await openAfterAuth(appUser);
    },
    onError: (error) => {
      console.error(error);
      setPermissionError("Bạn cần cho phép lấy thông tin Zalo để thiết lập Love Days.");
      setView("permission");
    },
  });

  const acceptInviteMutation = useMutation({
    mutationFn: async () => {
      if (!inviteCode) throw new Error("Thiếu mã lời mời.");
      const appUser = user ?? (await authorizeUser());
      const accepted = await inviteService.acceptInvite(inviteCode, appUser);
      return { appUser, accepted };
    },
    onSuccess: async ({ appUser, accepted }) => {
      setUser(appUser);
      setInviteError("");
      queryClient.setQueryData(coupleQueryKey(appUser.id), accepted);
      await queryClient.invalidateQueries({
        queryKey: anniversariesQueryKey(accepted.couple.id),
      });
      setView("home");
    },
    onError: (error) => {
      console.error(error);
      setInviteError(
        error instanceof Error
          ? error.message
          : "Không thể nhận lời mời. Vui lòng thử lại.",
      );
    },
  });

  const createCoupleMutation = useMutation({
    mutationFn: (input: SetupCoupleInput) => {
      if (!user) throw new Error("Bạn cần cấp quyền Zalo trước.");
      return coupleService.createCouple(user, input);
    },
    onMutate: () => {
      setSetupError("");
    },
    onSuccess: async (data, input) => {
      if (!user) return;
      const owner = data.members.find((member) => member.user_id === user.id)?.user;
      setUser(owner ?? { ...user, display_name: input.displayName });
      queryClient.setQueryData<CoupleWithMembers>(coupleQueryKey(user.id), data);
      await queryClient.invalidateQueries({
        queryKey: anniversariesQueryKey(data.couple.id),
      });
      setView("home");
    },
    onError: (error) => {
      console.error(error);
      setSetupError(
        error instanceof Error
          ? error.message
          : "Không thể tạo Love Days. Vui lòng thử lại.",
      );
    },
  });

  const invitePartnerMutation = useMutation({
    mutationFn: async () => {
      if (!user || !coupleData) {
        throw new Error("Bạn cần đăng nhập trước khi thêm đối tác.");
      }

      setInviteFeedback("");
      const invite = await inviteService.createInvite(coupleData.couple.id, user.id);
      return inviteService.shareInvite(
        invite.invite_code,
        user.custom_avatar_url || user.avatar_url || undefined,
      );
    },
    onSuccess: (result) => {
      setInviteFeedback(
        result.fallbackUsed
          ? "Không thể mở chia sẻ Zalo, liên kết mời đã được sao chép."
          : "Đã mở chia sẻ lời mời.",
      );
    },
    onError: (error) => {
      console.error(error);
      setInviteFeedback(
        error instanceof Error ? error.message : "Không thể tạo lời mời cho đối tác.",
      );
    },
  });

  const profileMutations = useProfileMutations({
    coupleData,
    queryClient,
    setUser,
    setView,
    user,
  });

  const addAnniversaryMutation = useMutation({
    mutationFn: async (draft: AnniversaryDraft) => {
      if (!user || !coupleData) throw new Error("Bạn cần cấp quyền Zalo trước.");
      return anniversaryService.create(coupleData.couple.id, user.id, draft);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: anniversariesQueryKey(coupleData?.couple.id),
      });
    },
  });

  return {
    acceptInviteMutation,
    addAnniversaryMutation,
    anniversariesQuery,
    authorizeMutation,
    coupleData,
    coupleQuery,
    createCoupleMutation,
    inviteError,
    inviteFeedback,
    invitePartnerMutation,
    leaveCoupleMutation: profileMutations.leaveCoupleMutation,
    permissionError,
    saveProfileMutation: profileMutations.saveProfileMutation,
    setupError,
    setView,
    updateStartDateMutation: profileMutations.updateStartDateMutation,
    user,
    view,
  };
}
