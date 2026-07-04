import { useQueryClient } from "@tanstack/react-query";
import { AppSpinner } from "@/components/zaui";
import { useLoveDaysAuth } from "@/hooks/useLoveDaysAuth";
import { setHomeViewState, useHomeViewState } from "@/hooks/useHomeViewState";
import { EditProfilePage } from "@/pages/edit-profile/EditProfilePage";
import { HomePage } from "@/pages/home/HomePage";
import { InviteAcceptPage } from "@/pages/invite-accept/InviteAcceptPage";
import { PermissionGate } from "@/pages/permission/PermissionGate";
import { SetupPage } from "@/pages/setup/SetupPage";

export function LoveDaysApp() {
  const queryClient = useQueryClient();
  const auth = useLoveDaysAuth({ queryClient });
  const state = useHomeViewState();

  if (state === "invite") {
    return (
      <InviteAcceptPage
        authorizeUser={auth.authorizeUser}
        inviteCode={auth.inviteCode}
        user={auth.user}
      />
    );
  }

  if (state === "permission" || state === "blocked") {
    return (
      <PermissionGate
        blocked={state === "blocked"}
        loading={auth.authorizeMutation.isPending}
        onAllow={() => auth.authorizeMutation.mutate()}
      />
    );
  }

  if (state === "setup" && auth.user) {
    return <SetupPage user={auth.user} />;
  }

  if (state === "edit" && auth.user) {
    return <EditProfilePage user={auth.user} />;
  }

  if (state === "home" && auth.user) {
    return <HomePage user={auth.user} />;
  }

  if (state === "booting") {
    return (
      <div className="boot-screen">
        <AppSpinner />
      </div>
    );
  }

  return (
    <PermissionGate
      loading={auth.authorizeMutation.isPending}
      onAllow={() => auth.authorizeMutation.mutate()}
    />
  );
}
