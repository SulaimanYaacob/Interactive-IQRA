import { ClientSideSuspense } from "@liveblocks/react";
import { Center, Loader } from "@mantine/core";
import { RoomProvider } from "liveblocks.config";
import { useRouter } from "next/router";
import { type ReactNode } from "react";

//TODO Create a current/selected room (selected room will replace once user create another room / join a room)
function LiveblocksProvider({ children }: { children: ReactNode }) {
  // const { data } = api.post.hello.useQuery({ text: "22" });
  // console.log({ data });

  const { query } = useRouter();
  const { roomId } = query;

  return (
    <RoomProvider id={String(roomId)} initialPresence={{ cursor: null }}>
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
