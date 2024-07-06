import {
  AppShell,
  Avatar,
  AvatarGroup,
  Button,
  Center,
  Container,
  CopyButton,
  Divider,
  Group,
  Text,
  Tooltip,
} from "@mantine/core";
import { useOthers, useSelf } from "liveblocks.config";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FaCheck, FaRegCopy } from "react-icons/fa6";
import { api } from "~/utils/api";
const LiveblocksProvider = dynamic(
  () => import("~/providers/LiveblocksProvider"),
  { ssr: false }
);
export default function RoomHeader() {
  const { query } = useRouter();
  const { roomId } = query as { roomId: string };
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
    <AppShell.Header>
      <Container h="100%">
        <Group h="100%" pos="relative" justify="space-between">
          <Button component="a" href="/" color="red">
            Exit Room
          </Button>
          <Center visibleFrom="xs" pos="absolute" left="30%" right="30%">
            <Group>
              <CopyButton value={roomPIN} timeout={2000}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? "Copied" : "Copy"}>
                    <Button
                      leftSection={copied ? <FaCheck /> : <FaRegCopy />}
                      color={copied ? "teal" : "gray"}
                      onClick={copy}
                      variant="subtle"
                      size="compact-lg"
                    >
                      <Text lts="3px" fw="500">
                        {roomPIN}
                      </Text>
                    </Button>
                  </Tooltip>
                )}
              </CopyButton>
              <Divider orientation="vertical" />
              <Text>{`Press "/" To Open Chat`}</Text>
            </Group>
          </Center>
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
    </AppShell.Header>
  );
}
