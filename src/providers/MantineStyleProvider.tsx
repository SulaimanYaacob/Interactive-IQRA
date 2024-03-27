import { MantineProvider, createTheme } from "@mantine/core";
import type { ReactNode } from "react";
import "@mantine/core/styles.css";

const theme = createTheme({
  /** Put your mantine theme override here */
});

function MantineStyleProvider({ children }: { children: ReactNode }) {
  return <MantineProvider theme={theme}>{children}</MantineProvider>;
}

export default MantineStyleProvider;
