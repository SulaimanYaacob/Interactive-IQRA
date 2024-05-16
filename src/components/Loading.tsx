import { Center, Loader } from "@mantine/core";

function Loading() {
  return (
    <Center pos="absolute" mih="100vh" w="100%" top={0} left={0}>
      <Loader />
    </Center>
  );
}

export default Loading;
