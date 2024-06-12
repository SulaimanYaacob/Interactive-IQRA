import {
  SignInButton,
  SignedIn,
  SignedOut,
  useClerk,
  useSession,
} from "@clerk/nextjs";
import {
  Anchor,
  AppShell,
  Avatar,
  Burger,
  Button,
  Container,
  Divider,
  Group,
  Indicator,
  Menu,
  UnstyledButton,
} from "@mantine/core";
import NativeImage from "~/components/NativeImage";
import ToggleTheme from "~/components/ToggleTheme";
import { CiDark, CiLight } from "react-icons/ci";
import Link from "next/link";
import {
  FaArrowRight,
  FaBell,
  FaRightFromBracket,
  FaUser,
} from "react-icons/fa6";
import { useRouter } from "next/router";

type Props = {
  openedMainNav: boolean;
  toggleMainNav: () => void;
};

function AppHeader({ openedMainNav, toggleMainNav }: Props) {
  const { session } = useSession();
  const { signOut } = useClerk();
  const { push } = useRouter();

  return (
    <AppShell.Header>
      {/* <Burger
        opened={openedMainNav}
        onClick={toggleMainNav}
        color="dimmed"
        visibleFrom="lg"
        pos="absolute"
        mx="sm"
      /> */}
      <Container h="100%">
        <Group h="100%" pos="relative" justify="space-between" align="center">
          <Group>
            <Burger
              opened={openedMainNav}
              onClick={toggleMainNav}
              // hiddenFrom="lg"
              hiddenFrom="xs"
              color="dimmed"
            />
            <UnstyledButton
              visibleFrom="sm"
              display="contents"
              component={Link}
              href="/"
            >
              <NativeImage src="/images/logo.png" alt="logo" width={150} />
            </UnstyledButton>
          </Group>
          <Group
            visibleFrom="xs"
            pos="absolute"
            gap="xl"
            left="20%"
            right="20%"
            justify="center"
          >
            <Anchor
              variant="gradient"
              td="none"
              fw="500"
              component={Link}
              href="/tutors/1"
            >
              View List of Tutors
            </Anchor>
            <Anchor
              component={Link}
              href="/tutor-application"
              variant="gradient"
              td="none"
              fw="500"
            >
              Apply as Tutor!
            </Anchor>
          </Group>
          <Group justify="flex-end">
            <SignedOut>
              <SignInButton mode="modal">
                <Button>Sign In</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Menu offset={15} withArrow>
                <Menu.Target>
                  <Indicator disabled={true} offset={5} position="bottom-end">
                    <Avatar
                      alt="profile"
                      src={session?.user.imageUrl}
                      style={{ cursor: "pointer" }}
                    />
                  </Indicator>
                </Menu.Target>
                <Menu.Dropdown fw={500}>
                  <Menu.Item
                    component={Link}
                    href={`/profile/${session?.user.id}`}
                    leftSection={<FaUser />}
                  >
                    View Profile
                  </Menu.Item>
                  <Menu.Item
                    component={Link}
                    href={`/appointments/today`}
                    leftSection={<FaBell />}
                  >
                    Appointments
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<FaRightFromBracket />}
                    onClick={() => signOut(() => push("/"))}
                  >
                    Logout
                  </Menu.Item>
                  {session?.user.publicMetadata.role === "ADMIN" && (
                    <>
                      <Divider />
                      <Menu.Item
                        href="/admin/applications"
                        component={Link}
                        leftSection={<FaArrowRight />}
                      >
                        Admin
                      </Menu.Item>
                    </>
                  )}
                </Menu.Dropdown>
              </Menu>
            </SignedIn>
            <ToggleTheme DarkIcon={CiDark} LightIcon={CiLight} />
          </Group>
        </Group>
      </Container>
    </AppShell.Header>
  );
}

export default AppHeader;
