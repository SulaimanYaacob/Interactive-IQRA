import { Center, Container, Stack } from "@mantine/core";

function Dummy() {
  // const { mutate } = api.liveblocks.createRoom.useMutation();

  return (
    <Container>
      <Center my="xl">
        <Stack>
          {/* <Title>{data?.greeting.firstName}</Title>
          <Button onClick={() => mutate()}>Create Room</Button> */}
        </Stack>
      </Center>
    </Container>
  );
}

export default Dummy;
