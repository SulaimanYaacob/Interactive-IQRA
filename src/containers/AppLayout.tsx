import { AppShell, AppShellMain } from "@mantine/core";
import React from "react";
import AppHeader from "./AppHeader";
import { useRouter } from "next/router";
import RoomHeader from "./RoomHeader";

function AppLayout({ children }: { children: React.ReactNode }) {
  const DynamicHeader = () => {
    const { pathname } = useRouter();
    if (pathname === "/rooms/[roomId]") return <RoomHeader />;
    return <AppHeader />;
  };

  return (
    <AppShell header={{ height: 76 }}>
      <DynamicHeader />
      <AppShellMain>{children}</AppShellMain>
    </AppShell>
  );
}

export default AppLayout;
