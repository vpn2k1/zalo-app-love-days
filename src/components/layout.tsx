import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { App, AppSnackbarProvider, ZMPRouter } from "@/components/zaui";
import { LoveDaysApp } from "@/love-days-app";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30 * 1000,
    },
  },
});

const Layout = () => {
  return (
    <App theme="light">
      <ZMPRouter memoryRouter>
        <QueryClientProvider client={queryClient}>
          <AppSnackbarProvider>
            <LoveDaysApp />
          </AppSnackbarProvider>
        </QueryClientProvider>
      </ZMPRouter>
    </App>
  );
};
export default Layout;
