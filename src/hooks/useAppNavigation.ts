import { useMemo } from "react";

import { useNavigate } from "@/components/zaui";
import { buildInvitePath } from "@/utils/invite";

export const appPaths = {
  album: "/album",
  anniversaries: "/anniversaries",
  blocked: "/blocked",
  booting: "/",
  calendar: "/calendar",
  dataDeletion: "/data-deletion",
  edit: "/edit",
  home: "/home",
  invite: "/invite",
  legal: "/legal",
  memory: "/memory",
  permission: "/permission",
  privacy: "/privacy",
  setup: "/setup",
  terms: "/terms",
} as const;

export const quickMemoryImageStorageKey = "love-days.quick-memory-image";

type NavigateOptions = {
  replace?: boolean;
};

export function useAppNavigation() {
  const navigate = useNavigate();

  return useMemo(
    () => ({
      goBoot: () => navigate(appPaths.booting, { replace: true }),
      goBack: () => navigate(-1),
      goAlbum: () => navigate(appPaths.album),
      goAnniversaries: (option?: NavigateOptions) =>
        navigate(appPaths.anniversaries, option),
      goCalendar: () => navigate(appPaths.calendar),
      goDataDeletion: () => navigate(appPaths.dataDeletion),
      goEdit: () => navigate(appPaths.edit),
      goHome: (options?: NavigateOptions) => navigate(appPaths.home, options),
      goLegal: () => navigate(appPaths.legal),
      goCreateMemory: (imageUrl?: string) => {
        if (imageUrl) {
          sessionStorage.setItem(quickMemoryImageStorageKey, imageUrl);
          navigate(`${appPaths.memory}?type=create&quickImage=1`);
          return;
        }

        navigate(`${appPaths.memory}?type=create`);
      },
      goMemory: (memoryId: string) => {
        navigate(
          `${appPaths.memory}?type=update&id=${encodeURIComponent(memoryId)}`,
        );
      },
      goInvite: (inviteCode: string, options?: NavigateOptions) =>
        navigate(buildInvitePath(inviteCode), options),
      goPermission: (options?: NavigateOptions) => {
        navigate(appPaths.permission, options);
      },
      goPrivacy: () => navigate(appPaths.privacy),
      goSetup: (options?: NavigateOptions) => navigate(appPaths.setup, options),
      goTerms: () => navigate(appPaths.terms),
    }),
    [navigate],
  );
}
