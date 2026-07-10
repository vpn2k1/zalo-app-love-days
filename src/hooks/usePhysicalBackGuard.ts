import { useEffect } from "react";
import { closeApp, offConfirmToExit, onConfirmToExit } from "zmp-sdk";

import { useLocation, useNavigate } from "@/components/zaui";
import { appPaths } from "@/hooks/useAppNavigation";

export function usePhysicalBackGuard() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    onConfirmToExit(() => {
      if (
        location.pathname === appPaths.home ||
        location.pathname === appPaths.setup ||
        location.pathname === appPaths.invite ||
        location.pathname === appPaths.permission
      ) {
        void closeApp();
        return;
      }

      navigate(-1);
    });

    return () => {
      offConfirmToExit();
    };
  }, [location.pathname, navigate]);
}
