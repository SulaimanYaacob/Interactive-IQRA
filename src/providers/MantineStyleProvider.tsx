import {
  Avatar,
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
import "@mantine/core/styles.css";

const theme = createTheme({
  black: "#383b43",
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
    Avatar: Avatar.extend({
      defaultProps: {
        bd: "solid 1px",
      },
    }),
  },
});

function MantineStyleProvider({ children }: { children: ReactNode }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <Notifications position="top-center" autoClose={3000} limit={3} />
      <ModalsProvider>{children}</ModalsProvider>
    </MantineProvider>
  );
}

export default MantineStyleProvider;
