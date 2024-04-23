import {
  AppShellHeader,
  Avatar,
  AvatarGroup,
  Button,
  Container,
  Group,
} from "@mantine/core";
import { useOthers, useSelf } from "liveblocks.config";

function RoomHeader() {
  const users = useOthers();
  const currentUser = useSelf();
  const hasMoreUsers = users.length > 3;

  return (
    <AppShellHeader py="lg">
      <Container>
        <Group justify="space-between">
          <Button component="a" href="/" color="red">
            Exit Room
          </Button>
          <Group>
            <AvatarGroup>
              <Avatar
                src={currentUser.info.avatar}
                alt={currentUser.info.name}
              />
              {users.slice(0, 3).map(({ connectionId, info }) => {
                return (
                  <Avatar
                    key={connectionId}
                    src={info.avatar}
                    alt={info.name}
                  />
                );
              })}
            </AvatarGroup>
          </Group>
        </Group>
      </Container>
    </AppShellHeader>
  );
}

export default RoomHeader;
