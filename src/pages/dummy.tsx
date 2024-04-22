import { Button, Center, Container, Stack, Title } from "@mantine/core";
import { api } from "~/utils/api";

function Dummy() {
  const { mutate } = api.post.create.useMutation();
  const { data } = api.post.hello.useQuery({ text: "nothinng" });

  console.log({ data });
  return (
    <Container my="xl">
      <Center>
        <Stack>
          <Title>{data?.greeting.firstName}</Title>
          <Button onClick={() => mutate({ name: "John Doe" })}>Add User</Button>
        </Stack>
      </Center>
    </Container>
  );
}

export default Dummy;
