import { type AppType } from "next/app";
import AppLayout from "~/containers/AppLayout";
import ClerkAuthProvider from "~/providers/ClerkAuthProvider";
import MantineStyleProvider from "~/providers/MantineStyleProvider";

import { api } from "~/utils/api";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkAuthProvider {...pageProps}>
      <MantineStyleProvider>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </MantineStyleProvider>
    </ClerkAuthProvider>
  );
};

export default api.withTRPC(MyApp);
