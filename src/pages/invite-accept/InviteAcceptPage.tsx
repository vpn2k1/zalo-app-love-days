import { useQueryClient } from "@tanstack/react-query";
import { BlockingLoadingOverlay } from "@/components/BlockingLoadingOverlay";
import { Page } from "@/components/zaui";
import { StatusBar } from "@/pages/home/items/StatusBar";
import { InviteAcceptAction } from "./items/InviteAcceptAction";
import { InviteAcceptCard } from "./items/InviteAcceptCard";
import { InviteAcceptHeader } from "./items/InviteAcceptHeader";
import { InviteAcceptHero } from "./items/InviteAcceptHero";
import { InviteAcceptStats } from "./items/InviteAcceptStats";
import { InviteConflictModal } from "./items/InviteConflictModal";
import { useInvitePageController } from "./modules/useInvitePageController";
import type { InviteAcceptPageProps } from "./types/InviteAcceptPageType";
import "../../css/app.css";

export function InviteAcceptPage({
  authorizeUser,
  inviteCode,
  user,
}: InviteAcceptPageProps) {
  const queryClient = useQueryClient();
  const invite = useInvitePageController({
    authorizeUser,
    inviteCode,
    queryClient,
    user,
  });
  const acceptInvite = async () => {
    await invite.acceptInviteMutation.mutateAsync();
  };

  return (
    <Page className="app-opening-page">
      <StatusBar />
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
