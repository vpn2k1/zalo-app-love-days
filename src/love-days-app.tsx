import { useCallback } from "react";

import {
  AnimationRoutes,
  AppSpinner,
  Box,
  Route,
} from "@/components/zaui";
import { appPaths } from "@/hooks/useAppNavigation";
import { useLoveDaysAuth } from "@/hooks/useLoveDaysAuth";
import { AlbumPage } from "@/pages/album/AlbumPage";
import { AnniversariesPage } from "@/pages/anniversaries/AnniversariesPage";
import { EditProfilePage } from "@/pages/edit-profile/EditProfilePage";
import { HomePage } from "@/pages/home/HomePage";
import { InviteAcceptPage } from "@/pages/invite-accept/InviteAcceptPage";
import { MemoryDetailPage } from "@/pages/memory-detail/MemoryDetailPage";
import { PermissionGate } from "@/pages/permission/PermissionGate";
import { SetupPage } from "@/pages/setup/SetupPage";

export function LoveDaysApp() {
  const { authorizeMutation, authorizeUser, inviteCode, user } = useLoveDaysAuth();
  const { isPending, mutate } = authorizeMutation;

  const allowPermission = useCallback(() => {
    mutate();
  }, [mutate]);

  return (
    <AnimationRoutes>
      <Route path={appPaths.booting} element={<BootRoute />} />
      <Route
        path={appPaths.invite}
        element={(
          <InviteRoute
            authorizeUser={authorizeUser}
            inviteCode={inviteCode}
            user={user}
          />
        )}
      />
      <Route
        path={appPaths.permission}
        element={(
          <PermissionRoute
            loading={isPending}
            onAllow={allowPermission}
          />
        )}
      />
      <Route
        path={appPaths.blocked}
        element={(
          <PermissionRoute
            blocked
            loading={isPending}
            onAllow={allowPermission}
          />
        )}
      />
      <Route
        path={appPaths.setup}
        element={<SetupRoute user={user} />}
      />
      <Route
        path={appPaths.home}
        element={<HomeRoute user={user} />}
      />
      <Route
        path={appPaths.edit}
        element={<EditRoute user={user} />}
      />
      <Route
        path={appPaths.album}
        element={<AlbumRoute user={user} />}
      />
      <Route
        path={appPaths.anniversaries}
        element={<AnniversariesRoute user={user} />}
      />
      <Route
        path={appPaths.memory}
        element={<MemoryDetailRoute user={user} />}
      />
      <Route
        path="*"
        element={(
          <PermissionRoute
            loading={isPending}
            onAllow={allowPermission}
          />
        )}
      />
    </AnimationRoutes>
  );
}

type AuthState = ReturnType<typeof useLoveDaysAuth>;
type AuthUser = AuthState["user"];
type AuthorizeUser = AuthState["authorizeUser"];

type InviteRouteProps = {
  authorizeUser: AuthorizeUser;
  inviteCode: string | null;
  user: AuthUser;
};

type PermissionRouteProps = {
  blocked?: boolean;
  loading: boolean;
  onAllow: () => void;
};

type ProtectedRouteProps = {
  user: AuthUser;
};

function BootRoute() {
  return <HomeLoadingState />;
}

function InviteRoute({ authorizeUser, inviteCode, user }: InviteRouteProps) {
  return (
    <InviteAcceptPage
      authorizeUser={authorizeUser}
      inviteCode={inviteCode}
      user={user}
    />
  );
}

function PermissionRoute({
  blocked,
  loading,
  onAllow,
}: PermissionRouteProps) {
  return (
    <PermissionGate
      blocked={blocked}
      loading={loading}
      onAllow={onAllow}
    />
  );
}

function SetupRoute({ user }: ProtectedRouteProps) {
  if (!user) return <BootRoute />;

  return <SetupPage user={user} />;
}

function HomeRoute({ user }: ProtectedRouteProps) {
  if (!user) return <BootRoute />;

  return <HomePage user={user} />;
}

function EditRoute({ user }: ProtectedRouteProps) {
  if (!user) return <BootRoute />;

  return <EditProfilePage user={user} />;
}

function AlbumRoute({ user }: ProtectedRouteProps) {
  if (!user) return <BootRoute />;

  return <AlbumPage user={user} />;
}

function AnniversariesRoute({ user }: ProtectedRouteProps) {
  if (!user) return <BootRoute />;

  return <AnniversariesPage user={user} />;
}

function MemoryDetailRoute({ user }: ProtectedRouteProps) {
  if (!user) return <BootRoute />;

  return <MemoryDetailPage user={user} />;
}

function HomeLoadingState() {
  return (
    <Box className="boot-screen">
      <AppSpinner />
    </Box>
  );
}
