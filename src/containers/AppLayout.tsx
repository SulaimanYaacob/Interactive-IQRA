import React from "react";
import dynamic from "next/dynamic";
import AppNavbar from "./AppNavbar";
import AppHeader from "./AppHeader";
import AdminHeader from "./AdminHeader";
import { useRouter } from "next/router";
import { useDisclosure } from "@mantine/hooks";
import { AppShell, AppShellMain } from "@mantine/core";
const DynamicRoomHeader = dynamic(() => import("./RoomHeader"), { ssr: false });

function AppLayout({ children }: { children: React.ReactNode }) {
  const [openedMainNav, { toggle: toggleMainNav, close: closeMainNav }] =
    useDisclosure(false);

  const { pathname } = useRouter();

  //TODO Create AppShell for different pages (Admin, Room, etc...)
  const DynamicHeader = () => {
    if (pathname === "/404") return null;
    if (pathname === "/room/[roomId]") return <DynamicRoomHeader />;
    if (pathname.includes("admin")) return <AdminHeader />;

    return (
      <AppHeader openedMainNav={openedMainNav} toggleMainNav={toggleMainNav} />
    );
  };

  return (
    <AppShell
      header={{ height: 76 }}
      navbar={{
        breakpoint: "xs",
        width: { xs: 200, md: 300 },
        collapsed: { desktop: true, mobile: !openedMainNav },
      }}
    >
      <DynamicHeader />
      <AppShellMain>{children}</AppShellMain>
      <AppNavbar />
    </AppShell>
  );
}

export default AppLayout;
