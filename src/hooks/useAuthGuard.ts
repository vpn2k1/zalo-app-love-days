import { useEffect } from "react";
import { useLocation } from "@/components/zaui";
import { appPaths, useAppNavigation } from "@/hooks/useAppNavigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export function useAuthGuard() {
  const { user } = useCurrentUser();
  const location = useLocation();
  const navigation = useAppNavigation();

  useEffect(() => {
    // If user is already loaded, no need to guard.
    if (user) return;

    // Public paths that do not require auth
    const publicPaths = [
      appPaths.booting,
      appPaths.permission,
      appPaths.blocked,
      appPaths.invite,
    ] as string[];

    if (!publicPaths.includes(location.pathname)) {
      navigation.goBoot();
    }
  }, [user, location.pathname, navigation]);
}
