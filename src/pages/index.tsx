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
import Link from "next/link";
import NativeImage from "~/components/NativeImage";

export default function Home() {
  // const { data } = api.post.hello.useQuery({ text: "Helo" });

  // if (!data) return;

  // const { greeting } = data;

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
          {menuOptions.map((option, idx) => (
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
                  <NativeImage
                    src={option.icons}
                    alt={option.title}
                    width={100}
                  />
                </Center>
                <Text>{option.description}</Text>
                <Button component={Link} href={option.link ?? ""}>
                  {option.title}
                </Button>
              </Stack>
            </Paper>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
