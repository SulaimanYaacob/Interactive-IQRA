import { AppShell, AppShellMain } from "@mantine/core";
import React from "react";
import AppHeader from "./AppHeader";
import { useRouter } from "next/router";
import RoomHeader from "./RoomHeader";
import { useSession } from "@clerk/nextjs";
import { ROLE } from "~/utils/constants";
import Error404 from "~/pages/404";

function AppLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useRouter();
  const { session } = useSession();
  const role = session?.user.publicMetadata.role;

  const DynamicHeader = () => {
    if (pathname === "/room/[roomId]") return <RoomHeader />;
    if (pathname.startsWith("/admin") && role === ROLE.ADMIN) return null;

    return <AppHeader />;
  };

  const AuthorizedMain = ({ children }: { children: React.ReactNode }) => {
    if (pathname.startsWith("/admin") && role !== ROLE.ADMIN)
      return <Error404 />;

    return <AppShellMain>{children}</AppShellMain>;
  };

  return (
    <AppShell header={{ height: 76 }}>
      <DynamicHeader />
      <AuthorizedMain>{children}</AuthorizedMain>
    </AppShell>
  );
}

export default AppLayout;
