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
import NativeImage from "~/components/NativeImage";
import useJoinRoom from "~/hooks/useJoinRoom";

export default function Home() {
  const { openJoinRoomModal, isLoading: SearchingRoom } = useJoinRoom();
  const menuOptions = [
    {
      icons: "/images/logo.png",
      description:
        "Create your own virtual rooms to get started, then invite your friends!",
      title: "Create Room",
    },
    {
      icons: "/images/logo.png",
      description:
        "Engage in an interactive learning with friends, family or tutors!",
      title: "Join Room",
      modal: openJoinRoomModal,
      loading: SearchingRoom,
    },
    {
      icons: "/images/logo.png",
      description:
        "Without any interruptions and at your own pace, independently explore and study.",
      title: "Self-Taught",
      link: "st/learn-iqra/1",
    },
  ];

  //! Currently Button is used as link component. This should be changed to popup a modal.

  return (
    <Container>
      <Stack my="xl" gap="xl">
        <Title my="xl" ta="center">
          Interactive IQRA
        </Title>
        <SimpleGrid spacing="xl" cols={{ base: 1, sm: 3 }}>
          {menuOptions.map(
            ({ icons, description, title, modal, loading }, idx) => (
              <Paper withBorder p="xs" key={idx}>
                <Stack
                  h={{ base: 350, sm: 500 }}
                  justify="space-between"
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
                  <Button onClick={modal} loading={loading}>
                    {title}
                  </Button>
                </Stack>
              </Paper>
            )
          )}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
