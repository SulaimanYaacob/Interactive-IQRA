import { AppShell } from "@mantine/core";
import React from "react";
import AppHeader from "./AppHeader";
import { useRouter } from "next/router";
import RoomHeader from "./RoomHeader";
import AppNavbar from "./AppNavbar";
import { useDisclosure } from "@mantine/hooks";

function AppLayout({ children }: { children: React.ReactNode }) {
  const [openedMainNav, { toggle: toggleMainNav, close: closeMainNav }] =
    useDisclosure(false); //Coupled with AppHeader and AppNavbar

  const { pathname } = useRouter();

  const DynamicHeader = () => {
    if (pathname === "/404") return null;
    if (pathname === "/room/[roomId]") {
      closeMainNav();
      return <RoomHeader />;
    }

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
      <AppShell.Main>{children}</AppShell.Main>
      <AppNavbar />
    </AppShell>
  );
}

export default AppLayout;
