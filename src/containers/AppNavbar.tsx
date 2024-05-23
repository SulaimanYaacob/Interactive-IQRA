import { SignedIn, useClerk } from "@clerk/nextjs";
import { AppShell, Divider, NavLink, Stack, Text } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";

const navigationList = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "View Tutors",
    path: "/tutors/1",
    dynamicPath: "/tutors",
  },
  {
    name: "Apply as Tutor",
    path: "/tutor-application",
  },
];

const miscellaneous = [
  {
    name: "FAQ",
    path: "/faq",
  },
];

type Props = {
  navigationList: typeof navigationList;
};
function AppNavbar() {
  const { signOut } = useClerk();
  const { pathname } = useRouter();

  return (
    <AppShell.Navbar>
      <Stack gap="0">
        <Text inline m="md" c="dimmed">
          Fundamentals
        </Text>
        {navigationList.map(({ name, path, dynamicPath }, idx) => {
          return (
            <NavLink
              py="xs"
              component={Link}
              key={idx}
              href={path ?? "/"}
              label={
                <Text mx="md" fw="500">
                  {name}
                </Text>
              }
              active={
                dynamicPath
                  ? pathname.startsWith(dynamicPath)
                  : pathname === path
              }
            />
          );
        })}
        <Divider />
        <Text inline m="md" c="dimmed">
          Rooms
        </Text>
        <NavLink
          bottom="0"
          py="xs"
          label={
            <Text mx="md" fw="500">
              View Rooms
            </Text>
          }
        />
        <Divider />
        <Text inline m="md" c="dimmed">
          Accounts
        </Text>
        <NavLink
          bottom="0"
          py="xs"
          label={
            <Text mx="md" fw="500">
              Notifications
            </Text>
          }
        />
        <SignedIn>
          <NavLink
            onClick={() => signOut()}
            c="red"
            bottom="0"
            py="xs"
            label={
              <Text mx="md" fw="500">
                Logout
              </Text>
            }
          />
        </SignedIn>
      </Stack>
    </AppShell.Navbar>
  );
}

export default AppNavbar;
