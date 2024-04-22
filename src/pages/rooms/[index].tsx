import { Container, Title } from "@mantine/core";
import { useOthers } from "liveblocks.config";

function Rooms() {
  const others = useOthers();
  const userCount = others.length;

  return (
    <Container size="lg" my="xl">
      <Title ta="center">There are {userCount + 1} users in the room</Title>
    </Container>
  );
}

export default Rooms;
