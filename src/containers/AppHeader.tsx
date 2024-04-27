import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  Anchor,
  AppShellHeader,
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

function AppHeader() {
  return (
    <AppShellHeader py="lg">
      <Container>
        <Group pos="relative" justify="space-between">
          <Burger hiddenFrom="sm" />
          <UnstyledButton
            visibleFrom="sm"
            display="contents"
            component={Link}
            href="/"
          >
            <NativeImage src="/images/logo.png" alt="logo" width={150} />
          </UnstyledButton>
          <Group
            visibleFrom="sm"
            pos="absolute"
            gap="xl"
            left="30%"
            right="30%"
            justify="center"
          >
            <Anchor
              variant="gradient"
              td="none"
              fw={500}
              component={Link}
              href="/tutors"
            >
              View List of Tutors
            </Anchor>
            <Anchor variant="gradient" td="none" fw={500}>
              Apply as Tutor!
            </Anchor>
          </Group>
          <Group>
            <SignedOut>
              <SignInButton mode="modal">
                <Button>Sign In</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <ToggleTheme DarkIcon={CiDark} LightIcon={CiLight} />
          </Group>
        </Group>
      </Container>
    </AppShellHeader>
  );
}

export default AppHeader;
