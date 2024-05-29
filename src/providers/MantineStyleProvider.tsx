import {
  Button,
  Chip,
  Container,
  MantineProvider,
  createTheme,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import type { ReactNode } from "react";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/core/styles.css";

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
    Chip: Chip.extend({
      defaultProps: {
        radius: "xs",
      },
    }),
  },
});

function MantineStyleProvider({ children }: { children: ReactNode }) {
  return (
    <MantineProvider theme={theme}>
      <Notifications position="top-center" autoClose={3000} limit={3} />
      <ModalsProvider>{children}</ModalsProvider>
    </MantineProvider>
  );
}

export default MantineStyleProvider;
