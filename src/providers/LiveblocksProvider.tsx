import { ClientSideSuspense } from "@liveblocks/react";
import { Button, Center, Loader, Paper, Stack, Title } from "@mantine/core";
import { RoomProvider } from "liveblocks.config";
import { useRouter } from "next/router";
import { type ReactNode } from "react";
import { api } from "~/utils/api";

//TODO Create a current/selected room (selected room will replace once user create another room / join a room)
type Props = {
  children: ReactNode;
  header?: boolean;
};

function LiveblocksProvider({ children, header }: Props) {
  const { query } = useRouter();
  const { roomId } = query as { roomId: string };
  const { data, isLoading } = api.liveblocks.getCurrentUserRoomAccess.useQuery({
    roomId,
  });

  if (!data && header) return;

  if (!data && !header && !isLoading)
    return (
      <Center mih="70vh">
        <Paper p="xl" withBorder m="xl">
          <Stack gap="xl">
            <Title ta="center">{`You do not have access to this room`}</Title>
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
    >
      <ClientSideSuspense
        fallback={
          header ?? (
            <Center mih="80vh">
              <Loader />
            </Center>
          )
        }
      >
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}

export default LiveblocksProvider;
