import { useCallback, useEffect, useState } from "react";
import { Spinner } from "zmp-ui";
import { PermissionGate } from "@/pages/PermissionGate";
import { SetupCouplePage } from "@/pages/SetupCouplePage";
import { HomePage } from "@/pages/HomePage";
import { InviteAcceptPage } from "@/pages/InviteAcceptPage";
import { EditProfilePage } from "@/pages/EditProfilePage";
import { authService } from "@/services/authService";
import { coupleService } from "@/services/coupleService";
import { inviteService } from "@/services/inviteService";
import { zaloService } from "@/services/zaloService";
import type { Anniversary } from "@/types/anniversary";
import type { CoupleWithMembers, SetupCoupleInput } from "@/types/couple";
import type { AppUser } from "@/types/user";
import { getInviteCodeFromUrl } from "@/utils/invite";

type AppView = "permission" | "blocked" | "invite" | "setup" | "home" | "edit";

export function LoveDaysApp() {
  const [view, setView] = useState<AppView>("permission");
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const [error, setError] = useState("");
  const [inviteCode] = useState(getInviteCodeFromUrl());
  const [user, setUser] = useState<AppUser | null>(null);
  const [coupleData, setCoupleData] = useState<CoupleWithMembers | null>(null);
  const [anniversaries, setAnniversaries] = useState<Anniversary[]>([]);

  useEffect(() => {
    if (inviteCode) {
      setView("invite");
    }
    setBooting(false);
  }, [inviteCode]);

  const loadCouple = useCallback(async (currentUser: AppUser) => {
    const data = await coupleService.getCoupleByUser(currentUser.id);
    setCoupleData(data);
    if (data) {
      const list = await coupleService.getAnniversaries(data.couple.id);
      setAnniversaries(list);
      setView("home");
    } else {
      setAnniversaries([]);
      setView("setup");
    }
  }, []);

  const authorizeAndLoadUser = useCallback(async () => {
    await zaloService.requestUserInfoPermission();
    const zaloUser = await zaloService.getCurrentUser();
    const appUser = await authService.upsertZaloUser(zaloUser);
    setUser(appUser);
    return appUser;
  }, []);

  const handleAllow = async () => {
    setLoading(true);
    setError("");
    try {
      const appUser = await authorizeAndLoadUser();
      await loadCouple(appUser);
    } catch (caught) {
      console.error(caught);
      setView("blocked");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvite = async () => {
    if (!inviteCode) return;
    setLoading(true);
    setError("");
    try {
      const appUser = user ?? (await authorizeAndLoadUser());
      const accepted = await inviteService.acceptInvite(inviteCode, appUser);
      const list = await coupleService.getAnniversaries(accepted.couple.id);
      setCoupleData(accepted);
      setAnniversaries(list);
      setView("home");
    } catch (caught) {
      console.error(caught);
      setError(
        caught instanceof Error
          ? caught.message
          : "Không thể nhận lời mời. Vui lòng thử lại.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCouple = async (input: SetupCoupleInput) => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await coupleService.createCouple(user, input);
      setCoupleData(data);
      const list = await coupleService.getAnniversaries(data.couple.id);
      setAnniversaries(list);
      setView("home");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPartner = async () => {
    if (!user || !coupleData) return;
    const invite = await inviteService.createInvite(coupleData.couple.id, user.id);
    await inviteService.shareInvite(invite.invite_code);
  };

  const handleSaveProfile = async (
    payload: Pick<AppUser, "display_name" | "custom_avatar_url">,
  ) => {
    if (!user) return;
    setLoading(true);
    try {
      const updated = await authService.updateProfile(user.id, payload);
      setUser(updated);
      if (coupleData) {
        await loadCouple(updated);
      }
      setView("home");
    } finally {
      setLoading(false);
    }
  };

  if (booting) {
    return (
      <div className="boot-screen">
        <Spinner />
      </div>
    );
  }

  if (view === "invite") {
    return (
      <InviteAcceptPage
        loading={loading}
        error={error}
        onAccept={handleAcceptInvite}
      />
    );
  }

  if (view === "permission" || view === "blocked") {
    return (
      <PermissionGate
        blocked={view === "blocked"}
        loading={loading}
        onAllow={handleAllow}
      />
    );
  }

  if (view === "setup" && user) {
    return (
      <SetupCouplePage user={user} loading={loading} onCreate={handleCreateCouple} />
    );
  }

  if (view === "edit" && user) {
    return (
      <EditProfilePage
        user={user}
        loading={loading}
        onBack={() => setView("home")}
        onSave={handleSaveProfile}
      />
    );
  }

  if (view === "home" && user && coupleData) {
    return (
      <HomePage
        user={user}
        coupleData={coupleData}
        anniversaries={anniversaries}
        onAddPartner={handleAddPartner}
        onEditProfile={() => setView("edit")}
      />
    );
  }

  return <PermissionGate loading={loading} onAllow={handleAllow} />;
}
