import { type AppType } from "next/app";
import MantineStyleProvider from "~/providers/MantineStyleProvider";

import { api } from "~/utils/api";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <MantineStyleProvider>
      <Component {...pageProps} />
    </MantineStyleProvider>
  );
};

export default api.withTRPC(MyApp);
