import { Button, Container, Group, Text, Title } from "@mantine/core";
import {
  useMyPresence,
  useOthers,
  useBroadcastEvent,
  useEventListener,
} from "liveblocks.config";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Cursor from "~/components/Cursor";
import { useElementLiveCursors } from "~/hooks/useElementLiveCursors";
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

function InteractiveRoom({ id }: { id: string }) {
  const [count, setCount] = useState(0);
  const broadcast = useBroadcastEvent();
  const others = useOthers();
  const userCount = others.length;
  const [{ cursor }] = useMyPresence();

  const containerRef = useRef<HTMLDivElement>(null);
  const cursors = useElementLiveCursors(id, containerRef);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  useEventListener(({ event }) => {
    switch (event.type) {
      case "increase":
        setCount((count) => count + 1);
        break;
      case "decrease":
        setCount((count) => count - 1);
        break;
    }
  });

  //* Using Margin Will Affect Cursor Position. Use Padding Instead.
  return (
    <Container
      fluid
      ref={containerRef}
      h={innerHeight - 76}
      //? Only when padding is necessary (Balance need to be added into the cursor position)
      // w={innerWidth - 64}
      // h={innerHeight - 108}
    >
      <Container py="xl">
        <Title ta="center">{userCount + 1} Users are in the room</Title>
        <Text ta="center">
          {cursor ? `${cursor.x} x ${cursor.y}` : "Move your cursor"}
        </Text>
        <Group justify="center" my="xl">
          <Button
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
      </Container>

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
            y={y + 76}
          />
        );
      })}
    </Container>
  );
}
