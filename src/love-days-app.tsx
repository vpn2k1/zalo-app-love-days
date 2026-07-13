import { AnimationRoutes, AppSpinner, Box, Route } from "@/components/zaui";
import { useAppBoot } from "@/hooks/useAppBoot";
import { appPaths } from "@/hooks/useAppNavigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useRouteScrollReset } from "@/hooks/useRouteScrollReset";
import { AlbumPage } from "@/pages/album/AlbumPage";
import { AnniversariesPage } from "@/pages/anniversaries/AnniversariesPage";
import { CalendarMemoriesPage } from "@/pages/calendar-memories/CalendarMemoriesPage";
import { EditProfilePage } from "@/pages/edit-profile/EditProfilePage";
import { HomePage } from "@/pages/home/HomePage";
import { InviteAcceptPage } from "@/pages/invite-accept/InviteAcceptPage";
import { MemoryDetail } from "@/pages/memory-detail/MemoryDetail";
import { PermissionGate } from "@/pages/permission/PermissionGate";
import { SetupPage } from "@/pages/setup/SetupPage";

export function LoveDaysApp() {
  useAuthGuard();
  useRouteScrollReset();

  return (
    <AnimationRoutes>
      <Route path={appPaths.booting} element={<BootRoute />} />
      <Route path={appPaths.invite} element={<InviteAcceptPage />} />
      <Route path={appPaths.permission} element={<PermissionGate />} />
      <Route path={appPaths.blocked} element={<PermissionGate blocked />} />
      <Route path={appPaths.setup} element={<SetupPage />} />
      <Route path={appPaths.home} element={<HomePage />} />
      <Route path={appPaths.edit} element={<EditProfilePage />} />
      <Route path={appPaths.album} element={<AlbumPage />} />
      <Route path={appPaths.calendar} element={<CalendarMemoriesPage />} />
      <Route path={appPaths.anniversaries} element={<AnniversariesPage />} />
      <Route path={appPaths.memory} element={<MemoryDetail />} />
      <Route path="*" element={<PermissionGate />} />
    </AnimationRoutes>
  );
}

function BootRoute() {
  useAppBoot();
  return (
    <Box className="boot-screen">
      <AppSpinner />
    </Box>
  );
}
