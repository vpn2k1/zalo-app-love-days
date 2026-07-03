import { Spinner } from "zmp-ui";
import { useLoveDaysController } from "@/hooks/useLoveDaysController";
import { EditProfilePage } from "@/pages/EditProfilePage";
import { HomePage } from "@/pages/HomePage";
import { InviteAcceptPage } from "@/pages/InviteAcceptPage";
import { PermissionGate } from "@/pages/PermissionGate";
import { SetupCouplePage } from "@/pages/SetupCouplePage";

export function LoveDaysApp() {
  const app = useLoveDaysController();

  if (app.view === "invite") {
    return (
      <InviteAcceptPage
        loading={app.acceptInviteMutation.isPending}
        error={app.inviteError}
        onAccept={async () => {
          await app.acceptInviteMutation.mutateAsync();
        }}
      />
    );
  }

  if (app.view === "permission" || app.view === "blocked") {
    return (
      <PermissionGate
        blocked={app.view === "blocked"}
        error={app.permissionError}
        loading={app.authorizeMutation.isPending}
        onAllow={() => app.authorizeMutation.mutate()}
      />
    );
  }

  if (app.view === "setup" && app.user) {
    return (
      <SetupCouplePage
        user={app.user}
        error={app.setupError}
        loading={app.createCoupleMutation.isPending}
        onCreate={async (input) => {
          await app.createCoupleMutation.mutateAsync(input);
        }}
      />
    );
  }

  if (app.view === "edit" && app.user) {
    return (
      <EditProfilePage
        user={app.user}
        leaveLoading={app.leaveCoupleMutation.isPending}
        loading={app.saveProfileMutation.isPending}
        onBack={() => app.setView("home")}
        onLeave={async () => {
          await app.leaveCoupleMutation.mutateAsync();
        }}
        onSave={async (payload) => {
          await app.saveProfileMutation.mutateAsync(payload);
        }}
      />
    );
  }

  if (app.view === "home" && app.user && app.coupleData) {
    return (
      <HomePage
        user={app.user}
        coupleData={app.coupleData}
        anniversaries={app.anniversariesQuery.data ?? []}
        addPartnerLoading={app.invitePartnerMutation.isPending}
        inviteFeedback={app.inviteFeedback}
        profileLoading={app.saveProfileMutation.isPending}
        addAnniversaryLoading={app.addAnniversaryMutation.isPending}
        onAddPartner={() => app.invitePartnerMutation.mutateAsync()}
        onSaveProfile={(payload) => app.saveProfileMutation.mutateAsync(payload)}
        onUpdateStartDate={(startDate) =>
          app.updateStartDateMutation.mutateAsync(startDate)}
        onAddAnniversary={(draft) => app.addAnniversaryMutation.mutateAsync(draft)}
        onEditProfile={() => app.setView("edit")}
      />
    );
  }

  if (app.coupleQuery.isFetching || app.anniversariesQuery.isFetching) {
    return (
      <div className="boot-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <PermissionGate
      error={app.permissionError}
      loading={app.authorizeMutation.isPending}
      onAllow={() => app.authorizeMutation.mutate()}
    />
  );
}
