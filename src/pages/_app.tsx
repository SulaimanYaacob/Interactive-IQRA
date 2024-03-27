import { type AppType } from "next/app";
import ClerkAuthProvider from "~/providers/ClerkAuthProvider";
import MantineStyleProvider from "~/providers/MantineStyleProvider";

import { api } from "~/utils/api";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkAuthProvider {...pageProps}>
      <MantineStyleProvider>
        <Component {...pageProps} />
      </MantineStyleProvider>
    </ClerkAuthProvider>
  );
};

export default api.withTRPC(MyApp);
