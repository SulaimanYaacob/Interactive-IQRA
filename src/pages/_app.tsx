import MantineStyleProvider from "~/providers/MantineStyleProvider";
import ClerkAuthProvider from "~/providers/ClerkAuthProvider";
import AppLayout from "~/containers/AppLayout";
import { type AppType } from "next/app";
import "@mantine/dates/styles.css";
import { api } from "~/utils/api";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Interactive Iqra</title>
        <meta
          name="description"
          content="A Real-time online experience for beginners to learn Iqra with friends and tutors or self-taught"
        />
        <meta
          name="keywords"
          content="Iqra, real-time, online, experience, beginners, self-taught, tutors, friends, learn"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Sulaiman Yaacob" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <ClerkAuthProvider {...pageProps}>
        <MantineStyleProvider>
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        </MantineStyleProvider>
      </ClerkAuthProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
