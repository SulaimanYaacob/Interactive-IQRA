import { ClientSideSuspense } from "@liveblocks/react";
import { Center, Loader } from "@mantine/core";
import { RoomProvider } from "liveblocks.config";
import { useRouter } from "next/router";
import { type ReactNode } from "react";

//TODO Create a current/selected room (selected room will replace once user create another room / join a room)
type Props = {
  children: ReactNode;
  header?: boolean;
};

function LiveblocksProvider({ children, header }: Props) {
  // const { data } = api.post.hello.useQuery({ text: "22" });
  // console.log({ data });

  const { query } = useRouter();
  const { roomId } = query;

  console.log({ roomId });

  return (
    <RoomProvider
      id={String(roomId)}
      initialPresence={{ cursor: null, elementId: null }}
    >
      <ClientSideSuspense
        fallback={
          header ?? (
            <Center mih="80vh">
              <Loader size="xl" />
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
