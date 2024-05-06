import { Button, Center, Container, Stack } from "@mantine/core";
import { api } from "~/utils/api";

function Dummy() {
  // const { mutate } = api.liveblocks.createRoom.useMutation();
  const { mutate } = api.liveblocks.deleteRoom.useMutation();

  return (
    <Container>
      <Center my="xl">
        <Stack>
          {/* <Title>{data?.greeting.firstName}</Title> */}
          <Button
            color="red"
            onClick={() =>
              mutate({ roomId: "10fe0ce2-865e-4741-8b38-c7cc3c0f6491" })
            }
          >
            Delete Room
          </Button>
        </Stack>
      </Center>
    </Container>
  );
}

export default Dummy;
