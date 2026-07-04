import { useSnackbar } from "zmp-ui";
import type { SnackbarOptions } from "zmp-ui/snackbar-provider";

type SnackbarPreset = Omit<SnackbarOptions, "icon" | "position"> & {
  icon?: SnackbarOptions["icon"];
  position?: SnackbarOptions["position"];
};

function withDefaults(options: SnackbarPreset): SnackbarOptions {
  return {
    duration: 2500,
    icon: true,
    position: "bottom",
    ...options,
  };
}

export function useAppSnackbar() {
  const snackbar = useSnackbar();

  return {
    ...snackbar,
    showSnackbar: (options: SnackbarPreset) => {
      snackbar.openSnackbar(withDefaults(options));
    },
    showError: (text: string, options?: SnackbarPreset) => {
      snackbar.openSnackbar(withDefaults({ ...options, text, type: "error" }));
    },
    showSuccess: (text: string, options?: SnackbarPreset) => {
      snackbar.openSnackbar(withDefaults({ ...options, text, type: "success" }));
    },
  };
}
