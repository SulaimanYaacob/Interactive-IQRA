import { ClientSideSuspense } from "@liveblocks/react";
import { Center, Loader } from "@mantine/core";
import { RoomProvider } from "liveblocks.config";
import { type ReactNode } from "react";

function LiveblocksProvider({ children }: { children: ReactNode }) {
  return (
    <RoomProvider id="my-room" initialPresence={{}}>
      <ClientSideSuspense
        fallback={
          <Center mih="50vh">
            <Loader size="xl" />
          </Center>
        }
      >
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}

export default LiveblocksProvider;
