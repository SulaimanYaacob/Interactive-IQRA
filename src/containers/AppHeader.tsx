import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useSession,
} from "@clerk/nextjs";
import {
  Anchor,
  AppShell,
  Burger,
  Button,
  Container,
  Group,
  UnstyledButton,
} from "@mantine/core";
import NativeImage from "~/components/NativeImage";
import ToggleTheme from "~/components/ToggleTheme";
import { CiDark, CiLight } from "react-icons/ci";
import Link from "next/link";

type Props = {
  openedMainNav: boolean;
  toggleMainNav: () => void;
};

function AppHeader({ openedMainNav, toggleMainNav }: Props) {
  const { session } = useSession();

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
              <UserButton
                userProfileMode="navigation"
                userProfileUrl={`/profile/${session?.user.id}`}
                afterSignOutUrl="/"
              />
            </SignedIn>
            <ToggleTheme DarkIcon={CiDark} LightIcon={CiLight} />
          </Group>
        </Group>
      </Container>
    </AppShell.Header>
  );
}

export default AppHeader;
