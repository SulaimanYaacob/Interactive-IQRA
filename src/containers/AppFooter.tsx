import { AppShell, Container, Group, Text } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaRegCopyright } from "react-icons/fa6";

function AppFooter() {
  const { pathname } = useRouter();

  if (pathname !== "/") return null;

  return (
    <AppShell.Footer withBorder={false}>
      <Container h="100%">
        <Group c="dimmed" gap="xs" h="100%" justify="center">
          <FaRegCopyright />
          <Text
            target="_blank"
            component={Link}
            href="https://github.com/SulaimanYaacob"
          >
            2024 Sulaiman Yaacob
          </Text>
        </Group>
      </Container>
    </AppShell.Footer>
  );
}

export default AppFooter;
