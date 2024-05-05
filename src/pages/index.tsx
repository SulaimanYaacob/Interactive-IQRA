import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import {
  Button,
  Center,
  Container,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useRouter } from "next/router";
import NativeImage from "~/components/NativeImage";
import useJoinRoom from "~/hooks/useJoinRoom";
import { logoFont } from "~/utils/nextFont";

export default function Home() {
  const { push } = useRouter();
  const { openJoinRoomModal, isLoading: SearchingRoom } = useJoinRoom();
  // const { openSelfTaughtModal } = useSelfTaughtOptions(); //? Not used due to unproposed features.

  const menuOptions = [
    {
      icons: "/images/logo.png",
      description:
        "Create your own virtual rooms to get started, then invite your friends!",
      title: "Create Room",
      authAccess: true,
      modal: openJoinRoomModal,
    },
    {
      icons: "/images/logo.png",
      description:
        "Engage in an interactive learning with friends, family or tutors!",
      title: "Join Room",
      modal: openJoinRoomModal,
      loading: SearchingRoom,
      authAccess: true,
    },
    {
      icons: "/images/logo.png",
      description:
        "Without any interruptions and at your own pace, independently explore and study.",
      title: "Self-Taught",
      link: "/st/iqra-1/1",
      modal: () => push("/st/iqra-1/1"),
      authAccess: false,
    },
  ];

  return (
    <Container>
      <Stack my="xl" gap="xl">
        <Title className={logoFont.className} mt="xl" ta="center">
          Interactive IQRA
        </Title>
        <SimpleGrid spacing="xl" cols={{ base: 1, sm: 3 }}>
          {menuOptions.map(
            (
              { icons, description, title, modal, loading, authAccess, link },
              idx
            ) => (
              <Paper withBorder p="xs" key={idx}>
                <Stack
                  h={{ base: 350, sm: 500 }}
                  justify="space-between"
                  // h="auto"
                  align="center"
                  ta="center"
                  gap="xl"
                  px="xs"
                  py="md"
                >
                  <Center py="xl">
                    <NativeImage src={icons} alt={title} width={100} />
                  </Center>
                  <Text>{description}</Text>
                  <ClerkLoaded>
                    <SignedIn>
                      <Button onClick={() => modal()} loading={loading}>
                        {title}
                      </Button>
                    </SignedIn>
                    <SignedOut>
                      {authAccess ? (
                        <SignInButton mode="modal">
                          <Button>{title}</Button>
                        </SignInButton>
                      ) : (
                        <Button onClick={() => modal()}>{title}</Button>
                      )}
                    </SignedOut>
                  </ClerkLoaded>
                  <ClerkLoading>
                    <Button loading>{title}</Button>
                  </ClerkLoading>
                </Stack>
              </Paper>
            )
          )}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
