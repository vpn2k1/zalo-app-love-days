import { useNavigate } from "@/components/zaui";

export const appPaths = {
  album: "/album",
  anniversaries: "/anniversaries",
  blocked: "/blocked",
  booting: "/",
  calendar: "/calendar",
  edit: "/edit",
  home: "/home",
  invite: "/invite",
  memory: "/memory",
  permission: "/permission",
  setup: "/setup",
} as const;

type NavigateOptions = {
  replace?: boolean;
};

export function useAppNavigation() {
  const navigate = useNavigate();

  return {
    goBoot: () => navigate(appPaths.booting, { replace: true }),
    goAlbum: () => navigate(appPaths.album),
    goAnniversaries: () => navigate(appPaths.anniversaries),
    goCalendar: () => navigate(appPaths.calendar),
    goEdit: () => navigate(appPaths.edit),
    goHome: (options?: NavigateOptions) => navigate(appPaths.home, options),
    goMemory: (memoryId: string) =>
      navigate(`${appPaths.memory}?id=${encodeURIComponent(memoryId)}`),
    goInvite: (options?: NavigateOptions) => navigate(appPaths.invite, options),
    goPermission: (options?: NavigateOptions) =>
      navigate(appPaths.permission, options),
    goSetup: (options?: NavigateOptions) => navigate(appPaths.setup, options),
  };
}
