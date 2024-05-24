import { Center, Pagination } from "@mantine/core";
import { useBroadcastEvent, useStorage, useMutation } from "liveblocks.config";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import Cursor from "~/components/Cursor";
import { useElementLiveCursors } from "~/hooks/useElementLiveCursors";
import iqraOneJson from "~/../public/iqra/iqra-1.json";
import IqraContent from "~/components/main-content.tsx/IqraContent";
const LiveblocksProvider = dynamic(
  () => import("~/providers/LiveblocksProvider"),
  { ssr: false }
);

const COLORS = [
  "#E57373",
  "#9575CD",
  "#4FC3F7",
  "#81C784",
  "#FFF176",
  "#FF8A65",
  "#F06292",
  "#7986CB",
];

export default function Room() {
  const { query } = useRouter();
  const { roomId } = query as { roomId: string };

  if (!roomId) return null;

  return (
    <LiveblocksProvider roomId={roomId}>
      <InteractiveRoom id={roomId} />
    </LiveblocksProvider>
  );
}

//TODO if you have time, create a nickname when they first join the room
function InteractiveRoom({ id }: { id: string }) {
  document.body.style.overflow = "hidden";
  const [opacity, setOpacity] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const cursors = useElementLiveCursors(id, containerRef);
  const broadcast = useBroadcastEvent();

  // const [count, setCount] = useState(0);
  // const others = useOthers();
  // useEventListener(({ event }) => {
  //   switch (event.type) {
  //     case "increase":
  //       setCount((count) => count + 1);
  //       break;
  //     case "decrease":
  //       setCount((count) => count - 1);
  //       break;
  //   }
  // });

  //********************************************************************************/

  const page = useStorage((root) => root.page);
  const totalPages = iqraOneJson.length;
  const content = iqraOneJson[page - 1]!;
  const nextPageLink = useMutation(
    ({ storage }, number: number) => {
      storage.set("page", number);
    },
    [page]
  );

  //TODO add iqra page!!
  //* Using Margin Will Affect Cursor Position. Use Padding Instead.
  return (
    //? Only when padding is necessary (Balance need to be added into the cursor position
    <>
      <Center
        ref={containerRef}
        mih="100vh"
        pos="absolute"
        w="100%"
        top={0}
        // w={innerWidth - 64}
        // h={innerHeight - 108}
      >
        <IqraContent
          content={content}
          isInteractive={{
            onClickNextPage: () => nextPageLink(page + 1),
            onClickPrevPage: () => nextPageLink(page - 1),
            disableNext: page === totalPages,
            disablePrev: page === 1,
          }}
        />
        <Pagination
          bottom={25}
          pos="absolute"
          visibleFrom="xs"
          value={page || 1}
          total={totalPages}
          onChange={(number) => nextPageLink(number)}
        />
        <Pagination
          size="sm"
          bottom={25}
          pos="absolute"
          hiddenFrom="xs"
          value={page || 1}
          total={totalPages}
          onChange={(number) => nextPageLink(number)}
        />
        {cursors.map((cursor) => {
          if (!cursor?.connectionId) return null;
          const { connectionId, x, y, info } = cursor;
          return (
            <Cursor
              opacity={opacity}
              key={connectionId}
              info={info}
              color={String(COLORS[connectionId % COLORS.length])}
              // x={x + 32}
              x={x}
              y={y}
            />
          );
        })}
      </Center>
    </>
  );
}

{
  /* <Container py="xl">
        <Paper style={{ zIndex: -1 }} withBorder p="xl">
          <Title ta="center">{userCount + 1} Users are in the room</Title>
          <Text ta="center">
            {cursor ? `${cursor.x} x ${cursor.y}` : "Move your cursor"}
          </Text>
          <Group justify="center" mt="xl">
            <Button
              style={{ zIndex: 2 }}
              onClick={() => {
                broadcast({ type: "increase" });
                setCount((count) => count + 1);
              }}
              variant="outline"
            >
              +
            </Button>
            <Title key={count} ta="center">
              {count}
            </Title>
            <Button
              onClick={() => {
                broadcast({ type: "decrease" });
                setCount((count) => count - 1);
              }}
              variant="outline"
            >
              -
            </Button>
            <Button onClick={() => setOpacity(0.1)}>Read Mode</Button>
            <Button onClick={() => setOpacity(1)}>Reset</Button>
          </Group>
        </Paper>
      </Container> */
}
