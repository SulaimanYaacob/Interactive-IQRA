import { Center, Container, Stack } from "@mantine/core";
import { api } from "~/utils/api";

function Dummy() {
  const { mutate } = api.liveblocks.createRoom.useMutation();
  const { data } = api.liveblocks.checkRoomIsJoined.useQuery({ roomId: "123" });

  return (
    <Container>
      <Center my="xl">
        <Stack>
          {/* <Title>{data?.greeting.firstName}</Title> */}
          {/* <Button onClick={() => mutate()}>Create Room</Button> */}
        </Stack>
      </Center>
    </Container>
  );
}

export default Dummy;
