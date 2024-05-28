import { Button, Center, Stack, Text } from "@mantine/core";
import Link from "next/link";

//* Simplicity is the best
function Error404() {
  return (
    <Center pos="absolute" mih="100vh" w="100vw" top={0} left={0}>
      <Stack
        p="xl"
        gap="0"
        style={{
          border: "solid 1px",
          boxShadow: "5px 5px 0",
        }}
      >
        <Text fw="700" inline fz={{ base: "3rem", sm: "7rem" }}>
          404 Error
        </Text>
        <Text fw="500" inline fz={{ base: "1.5rem", sm: "2rem" }}>
          Page not found
        </Text>
        <Button
          mt="xl"
          href="/"
          radius="0"
          component={Link}
          variant="default"
          style={{ border: "solid 1px" }}
        >
          Return Home
        </Button>
      </Stack>
    </Center>
  );
}

export default Error404;
