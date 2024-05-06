import {
  AppShellHeader,
  Avatar,
  AvatarGroup,
  Button,
  Container,
  Group,
} from "@mantine/core";
import { useOthers, useSelf } from "liveblocks.config";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
const LiveblocksProvider = dynamic(
  () => import("~/providers/LiveblocksProvider"),
  { ssr: false }
);
export default function RoomHeader() {
  const { query } = useRouter();

  const { roomId } = query as { roomId: string };
  if (!roomId) return null;

  const { data } = api.liveblocks.getCurrentRoomDetails.useQuery({ roomId });
  if (!data) return null;

  const { roomPIN } = data;

  return (
    <LiveblocksProvider roomId={roomId} header>
      <LiveblocksHeader roomPIN={String(roomPIN)} />
    </LiveblocksProvider>
  );
}

function LiveblocksHeader({ roomPIN }: { roomPIN: string }) {
  const users = useOthers();
  const currentUser = useSelf();

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
