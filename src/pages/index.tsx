import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import {
  Button,
  Container,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import Image from "next/image";
import { useRouter } from "next/router";
import useCreateRoom from "~/hooks/useCreateRoom";
import useJoinRoom from "~/hooks/useJoinRoom";
import { logoFont } from "~/utils/nextFont";

export default function Home() {
  const { push } = useRouter();
  const { openJoinRoomModal, isLoading: SearchingRoom } = useJoinRoom();
  // const { openSelfTaughtModal } = useSelfTaughtOptions(); //? Not used due to unproposed features.
  const { openSelfTaughtModal } = useCreateRoom();

  const menuOptions = [
    {
      icons: "/images/create-room.png",
      description:
        "Create your own virtual rooms to get started, then invite anyone!",
      title: "Create Room",
      authAccess: true,
      modal: openSelfTaughtModal,
    },
    {
      icons: "/images/join-room.png",
      description:
        "Engage in an interactive learning with friends, family or tutors!",
      title: "Join Room",
      modal: openJoinRoomModal,
      loading: SearchingRoom,
      authAccess: true,
    },
    {
      icons: "/images/self-taught.png",
      description:
        "Independently explore and study at your own pace, uninterrupted.",
      title: "Self-Taught",
      modal: () => push("/st/learn-iqra"),
      authAccess: false,
    },
  ];

  return (
    <Container>
      <Stack gap="xl" mih="75vh" justify="center">
        <Title
          fz={{ base: "40px", sm: "60px" }}
          className={logoFont.className}
          ta="center"
          lts="1.5px"
          mt="xl"
        >
          Interactive IQRA
        </Title>
        <SimpleGrid spacing="xl" cols={{ base: 1, sm: 3 }}>
          {menuOptions.map(
            (
              { icons, description, title, modal, loading, authAccess },
              idx
            ) => (
              <Paper
                p="xs"
                w="100%"
                key={idx}
                style={{
                  borderWidth: "2px",
                  boxShadow: "0px 0px 5px var(--mantine-color-blue-2)",
                }}
              >
                <Stack
                  h={{ base: 350, sm: 425 }}
                  justify="space-between"
                  align="center"
                  ta="center"
                  gap="xl"
                  px="xs"
                  py="xl"
                >
                  <Image src={icons} alt={title} width={125} height={125} />
                  <Text fw="500">{description}</Text>
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
