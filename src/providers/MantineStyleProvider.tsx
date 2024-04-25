import { Button, Container, MantineProvider, createTheme } from "@mantine/core";
import type { ReactNode } from "react";
import "@mantine/core/styles.css";
import { ModalsProvider } from "@mantine/modals";

const theme = createTheme({
  components: {
    Button: Button.extend({
      defaultProps: {
        variant: "light",
      },
    }),
    Container: Container.extend({
      defaultProps: {
        size: "lg",
      },
    }),
  },
});

function MantineStyleProvider({ children }: { children: ReactNode }) {
  return (
    <MantineProvider theme={theme}>
      <ModalsProvider>{children}</ModalsProvider>
    </MantineProvider>
  );
}

export default MantineStyleProvider;
