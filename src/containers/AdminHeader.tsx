import { AppShell, Avatar, Burger, Container, Group } from "@mantine/core";

function AdminHeader() {
  return (
    <AppShell.Header>
      <Container h="100%">
        <Group h="100%" justify="space-between">
          <Burger />
          <Avatar />
        </Group>
      </Container>
    </AppShell.Header>
  );
}

export default AdminHeader;
