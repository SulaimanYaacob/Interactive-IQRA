import { Button, Center, Container, Stack, Title } from "@mantine/core";
import { api } from "~/utils/api";

function Dummy() {
  const { mutate } = api.post.create.useMutation();

  return (
    <Container my="xl">
      <Center>
        <Stack>
          <Title>Test CRUD Method</Title>
          <Button onClick={() => mutate({ name: "John Doe" })}>Add User</Button>
        </Stack>
      </Center>
    </Container>
  );
}

export default Dummy;
