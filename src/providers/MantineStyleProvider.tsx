import { Button, MantineProvider, createTheme } from "@mantine/core";
import type { ReactNode } from "react";
import "@mantine/core/styles.css";

const theme = createTheme({
  components: {
    Button: Button.extend({
      defaultProps: {
        variant: "light",
      },
    }),
  },
});

function MantineStyleProvider({ children }: { children: ReactNode }) {
  return <MantineProvider theme={theme}>{children}</MantineProvider>;
}

export default MantineStyleProvider;
