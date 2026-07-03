import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "zmp-ui";
import { PermissionGate } from "@/pages/PermissionGate";
import { SetupCouplePage } from "@/pages/SetupCouplePage";
import { HomePage } from "@/pages/HomePage";
import { InviteAcceptPage } from "@/pages/InviteAcceptPage";
import { EditProfilePage } from "@/pages/EditProfilePage";
import { authService } from "@/services/authService";
import { anniversaryService } from "@/services/anniversaryService";
import { coupleService } from "@/services/coupleService";
import { inviteService } from "@/services/inviteService";
import { zaloService } from "@/services/zaloService";
import type { AnniversaryDraft } from "@/types/anniversary";
import type { CoupleWithMembers, SetupCoupleInput } from "@/types/couple";
import type { AppUser } from "@/types/user";
import { getInviteCodeFromUrl } from "@/utils/invite";

type AppView = "permission" | "blocked" | "invite" | "setup" | "home" | "edit";

const coupleQueryKey = (userId?: string) => ["couple", userId] as const;
const anniversariesQueryKey = (coupleId?: string) =>
  ["anniversaries", coupleId] as const;

export function LoveDaysApp() {
  const queryClient = useQueryClient();
  const inviteCode = useMemo(getInviteCodeFromUrl, []);
  const [view, setView] = useState<AppView>(inviteCode ? "invite" : "permission");
  const [user, setUser] = useState<AppUser | null>(null);
  const [inviteError, setInviteError] = useState("");
  const [inviteFeedback, setInviteFeedback] = useState("");

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
    onSuccess: openAfterAuth,
    onError: (error) => {
      console.error(error);
      setView("blocked");
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
    onSuccess: async (data, input) => {
      if (!user) return;
      setUser({ ...user, display_name: input.displayName });
      queryClient.setQueryData<CoupleWithMembers>(coupleQueryKey(user.id), data);
      await queryClient.invalidateQueries({
        queryKey: anniversariesQueryKey(data.couple.id),
      });
      setView("home");
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

  const saveProfileMutation = useMutation({
    mutationFn: async (payload: {
      display_name: string;
      custom_avatar_url: string | null;
      start_date: string;
    }) => {
      if (!user || !coupleData) throw new Error("Bạn cần cấp quyền Zalo trước.");

      const updatedUser = await authService.updateProfile(user.id, {
        display_name: payload.display_name,
        custom_avatar_url: payload.custom_avatar_url,
      });
      await coupleService.updateCoupleStartDate(coupleData.couple.id, payload.start_date);
      return updatedUser;
    },
    onSuccess: async (updated) => {
      setUser(updated);
      await queryClient.invalidateQueries({ queryKey: coupleQueryKey(updated.id) });
      setView("home");
    },
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

  if (view === "invite") {
    return (
      <InviteAcceptPage
        loading={acceptInviteMutation.isPending}
        error={inviteError}
        onAccept={async () => {
          await acceptInviteMutation.mutateAsync();
        }}
      />
    );
  }

  if (view === "permission" || view === "blocked") {
    return (
      <PermissionGate
        blocked={view === "blocked"}
        loading={authorizeMutation.isPending}
        onAllow={() => authorizeMutation.mutate()}
      />
    );
  }

  if (view === "setup" && user) {
    return (
      <SetupCouplePage
        user={user}
        loading={createCoupleMutation.isPending}
        onCreate={async (input) => {
          await createCoupleMutation.mutateAsync(input);
        }}
      />
    );
  }

  if (view === "edit" && user) {
    return (
      <EditProfilePage
        user={user}
        startDate={coupleData?.couple.start_date}
        loading={saveProfileMutation.isPending}
        onBack={() => setView("home")}
        onSave={async (payload) => {
          await saveProfileMutation.mutateAsync(payload);
        }}
      />
    );
  }

  if (view === "home" && user && coupleData) {
    return (
      <HomePage
        user={user}
        coupleData={coupleData}
        anniversaries={anniversariesQuery.data ?? []}
        addPartnerLoading={invitePartnerMutation.isPending}
        inviteFeedback={inviteFeedback}
        profileLoading={saveProfileMutation.isPending}
        addAnniversaryLoading={addAnniversaryMutation.isPending}
        onAddPartner={() => invitePartnerMutation.mutateAsync()}
        onSaveProfile={(payload) => saveProfileMutation.mutateAsync(payload)}
        onAddAnniversary={(draft) => addAnniversaryMutation.mutateAsync(draft)}
        onEditProfile={() => setView("edit")}
      />
    );
  }

  if (coupleQuery.isFetching || anniversariesQuery.isFetching) {
    return (
      <div className="boot-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <PermissionGate
      loading={authorizeMutation.isPending}
      onAllow={() => authorizeMutation.mutate()}
    />
  );
}
