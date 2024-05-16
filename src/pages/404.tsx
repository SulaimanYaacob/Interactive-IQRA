import { Center, Stack, Text, Title } from "@mantine/core";

function Error404() {
  return (
    <Center pos="absolute" mih="100vh" w="100vw" top={0} left={0}>
      <Stack gap="0">
        <Title fz={{ base: "3rem", sm: "7rem" }}>404 Error</Title>
        <Text inline fz={{ base: "1.5rem", sm: "2rem" }}>
          Page not found
        </Text>
      </Stack>
    </Center>
  );
}

export default Error404;
