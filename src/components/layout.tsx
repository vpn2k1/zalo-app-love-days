import { getSystemInfo } from "zmp-sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  App,
  SnackbarProvider,
  ZMPRouter,
} from "zmp-ui";
import { AppProps } from "zmp-ui/app";

import { LoveDaysApp } from "@/love-days-app";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30 * 1000,
    },
  },
});

const getZaloTheme = (): AppProps["theme"] => {
  try {
    return (getSystemInfo().zaloTheme || "light") as AppProps["theme"];
  } catch (error) {
    console.warn("Cannot read Zalo system theme, fallback to light.", error);
    return "light" as AppProps["theme"];
  }
};

const Layout = () => {
  return (
    <App theme={getZaloTheme()}>
      <ZMPRouter memoryRouter>
        <QueryClientProvider client={queryClient}>
          <SnackbarProvider>
            <LoveDaysApp />
          </SnackbarProvider>
        </QueryClientProvider>
      </ZMPRouter>
    </App>
  );
};
export default Layout;
