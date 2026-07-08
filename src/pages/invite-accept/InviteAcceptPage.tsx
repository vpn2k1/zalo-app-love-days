import { BlockingLoadingOverlay } from "@/components/BlockingLoadingOverlay";
import { Page } from "@/components/zaui";
import { InviteAcceptAction } from "./items/InviteAcceptAction";
import { InviteAcceptCard } from "./items/InviteAcceptCard";
import { InviteAcceptHeader } from "./items/InviteAcceptHeader";
import { InviteAcceptHero } from "./items/InviteAcceptHero";
import { InviteAcceptStats } from "./items/InviteAcceptStats";
import { InviteConflictModal } from "./items/InviteConflictModal";
import { useInviteAcceptance } from "./modules/useInviteAcceptance";
import "../../css/app.css";
import { AppStatusBar } from "@/components/AppStatusBar";

export function InviteAcceptPage() {
  const invite = useInviteAcceptance();
  const acceptInvite = async () => {
    await invite.acceptInviteMutation.mutateAsync();
  };

  return (
    <Page className="app-opening-page">
      <AppStatusBar />
      <InviteAcceptHeader />
      <InviteAcceptHero />
      <InviteAcceptCard />
      <InviteAcceptStats />
      <InviteAcceptAction
        loading={invite.acceptInviteMutation.isPending}
        onAccept={acceptInvite}
      />
      <InviteConflictModal
        conflictMessage={invite.inviteConflict}
        loading={invite.acceptInviteMutation.isPending}
        onCloseConflict={invite.closeInviteConflict}
      />
      <BlockingLoadingOverlay
        show={invite.acceptInviteMutation.isPending}
        message="Đang ghép đôi..."
      />
    </Page>
  );
}
