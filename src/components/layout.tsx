import { getSystemInfo } from "zmp-sdk";
import {
  App,
  SnackbarProvider,
} from "zmp-ui";
import { AppProps } from "zmp-ui/app";

import { LoveDaysApp } from "@/love-days-app";

const Layout = () => {
  return (
    <App theme={getSystemInfo().zaloTheme as AppProps["theme"]}>
      <SnackbarProvider>
        <LoveDaysApp />
      </SnackbarProvider>
    </App>
  );
};
export default Layout;
