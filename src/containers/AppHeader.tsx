import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  Anchor,
  AppShellHeader,
  Button,
  Container,
  Group,
} from "@mantine/core";
import NativeImage from "~/components/NativeImage";

function AppHeader() {
  return (
    <AppShellHeader py="lg">
      <Container size="lg">
        <Group pos="relative" justify="space-between">
          <NativeImage src="/images/logo.png" alt="logo" width={150} />
          <Group pos="absolute" gap="xl" left="0%" right="0" justify="center">
            <Anchor variant="gradient" td="none">
              View List of Tutors
            </Anchor>
            <Anchor variant="gradient" td="none">
              Apply as Tutor!
            </Anchor>
          </Group>
          <SignedOut>
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Group>
      </Container>
    </AppShellHeader>
  );
}

export default AppHeader;
