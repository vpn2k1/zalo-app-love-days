import { useCallback, useMemo } from "react";
import { useNavigate } from "@/components/zaui";

export const appPaths = {
  album: "/album",
  anniversaries: "/anniversaries",
  blocked: "/blocked",
  booting: "/",
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

  const goAlbum = useCallback(() => {
    navigate(appPaths.album);
  }, [navigate]);

  const goAnniversaries = useCallback(() => {
    navigate(appPaths.anniversaries);
  }, [navigate]);

  const goEdit = useCallback(() => {
    navigate(appPaths.edit);
  }, [navigate]);

  const goHome = useCallback((options?: NavigateOptions) => {
    navigate(appPaths.home, options);
  }, [navigate]);

  const goMemory = useCallback((memoryId: string) => {
    navigate(`${appPaths.memory}?id=${encodeURIComponent(memoryId)}`);
  }, [navigate]);

  const goInvite = useCallback((options?: NavigateOptions) => {
    navigate(appPaths.invite, options);
  }, [navigate]);

  const goPermission = useCallback((options?: NavigateOptions) => {
    navigate(appPaths.permission, options);
  }, [navigate]);

  const goSetup = useCallback((options?: NavigateOptions) => {
    navigate(appPaths.setup, options);
  }, [navigate]);

  return useMemo(
    () => ({
      goAlbum,
      goAnniversaries,
      goEdit,
      goHome,
      goInvite,
      goMemory,
      goPermission,
      goSetup,
    }),
    [
      goAlbum,
      goAnniversaries,
      goEdit,
      goHome,
      goInvite,
      goMemory,
      goPermission,
      goSetup,
    ],
  );
}
