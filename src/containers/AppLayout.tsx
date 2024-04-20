import { AppShell, AppShellMain } from "@mantine/core";
import React from "react";
import AppHeader from "./AppHeader";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell header={{ height: 76 }}>
      <AppHeader />
      <AppShellMain>{children}</AppShellMain>
    </AppShell>
  );
}

export default AppLayout;
