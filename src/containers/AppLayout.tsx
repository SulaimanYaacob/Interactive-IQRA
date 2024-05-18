import { AppShell, AppShellHeader } from "@mantine/core";
import React from "react";
import { useRouter } from "next/router";
import AppNavbar from "./AppNavbar";
import { useDisclosure } from "@mantine/hooks";
import AdminHeader from "./AdminHeader";
import dynamic from "next/dynamic";
const DynamicRoomHeader = dynamic(() => import("./RoomHeader"), { ssr: false });
const DynamicAppHeader = dynamic(() => import("./AppHeader"), {
  ssr: false,
  loading: () => <AppShellHeader />,
});

function AppLayout({ children }: { children: React.ReactNode }) {
  const [openedMainNav, { toggle: toggleMainNav, close: closeMainNav }] =
    useDisclosure(false);

  const { pathname } = useRouter();

  const DynamicHeader = () => {
    if (pathname === "/404") return null;
    if (pathname === "/room/[roomId]") {
      closeMainNav();
      return <DynamicRoomHeader />;
    }

    if (pathname.includes("admin")) return <AdminHeader />;

    return (
      <DynamicAppHeader
        openedMainNav={openedMainNav}
        toggleMainNav={toggleMainNav}
      />
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
