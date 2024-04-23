import { Button, Center, Container, Stack, Title } from "@mantine/core";
import { api } from "~/utils/api";

function Dummy() {
  const { mutate } = api.liveblocks.createRoom.useMutation();
  const { data } = api.post.hello.useQuery({ text: "nothinng" });

  console.log({ data });
  return (
    <Container my="xl">
      <Center>
        <Stack>
          <Title>{data?.greeting.firstName}</Title>
          <Button onClick={() => mutate()}>Create Room</Button>
        </Stack>
      </Center>
    </Container>
  );
}

export default Dummy;
