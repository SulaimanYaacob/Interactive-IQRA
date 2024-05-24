import { ClientSideSuspense } from "@liveblocks/react";
import { Button, Center, Paper, Stack, Title } from "@mantine/core";
import { RoomProvider } from "liveblocks.config";
import { type ReactNode } from "react";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";

//TODO Create a current/selected room (selected room will replace once user create another room / join a room)
type Props = {
  children: ReactNode;
  header?: boolean;
  roomId: string;
};

function LiveblocksProvider({ children, header, roomId }: Props) {
  const { data: userAccess, failureCount } =
    api.liveblocks.getCurrentUserRoomAccess.useQuery(
      { roomId },
      { refetchOnWindowFocus: false }
    );

  //TODO Maybe add 1 more attributes to room model (page) and iqraPage into storage.
  // const {} = api.liveblocks.getCurrentRoomDetails

  if (!userAccess && header) return;

  if (!userAccess && !header && failureCount > 0)
    return (
      <Center mih="75vh">
        <Paper p="xl" withBorder m="xl">
          <Stack gap="xl">
            <Title ta="center">You do not have access to this room</Title>
            <Center>
              <Button color="red" component="a" href="/">
                Exit Page
              </Button>
            </Center>
          </Stack>
        </Paper>
      </Center>
    );

  return (
    <RoomProvider
      id={String(roomId)}
      initialPresence={{ cursor: null, elementId: null }}
      initialStorage={{ page: 1 }}
    >
      <ClientSideSuspense fallback={header ?? <Loading />}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}

export default LiveblocksProvider;
