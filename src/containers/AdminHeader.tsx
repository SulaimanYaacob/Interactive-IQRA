import {
  AppShellHeader,
  Avatar,
  Burger,
  Container,
  Group,
} from "@mantine/core";

function AdminHeader() {
  return (
    <AppShellHeader>
      <Container h="100%">
        <Group h="100%" justify="space-between">
          <Burger />
          <Avatar />
        </Group>
      </Container>
    </AppShellHeader>
  );
}

export default AdminHeader;
