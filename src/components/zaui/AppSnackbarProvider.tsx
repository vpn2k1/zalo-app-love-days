import { SnackbarProvider } from "zmp-ui";
import type { SnackbarProps } from "zmp-ui/snackbar-provider";

export function AppSnackbarProvider({ children, ...snackbarProps }: SnackbarProps) {
  return (
    <SnackbarProvider {...snackbarProps}>
      {children}
    </SnackbarProvider>
  );
}
