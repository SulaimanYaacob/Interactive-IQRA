import { Container, Paper, SimpleGrid, Text, Title } from "@mantine/core";
import { useMyPresence, useOthers } from "liveblocks.config";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useRef } from "react";
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
      <InteractiveRoom id="room" />
    </LiveblocksProvider>
  );
}

function InteractiveRoom({ id }: { id: string }) {
  const others = useOthers();
  const userCount = others.length;
  const [{ cursor }] = useMyPresence();

  const containerRef = useRef<HTMLDivElement>(null);
  const cursors = useElementLiveCursors(id, containerRef);

  //? Use window's viewport instead of mantine's useViewPort (It takes time to render and cause the UI to render container's viewport)
  const { innerHeight, innerWidth } = window;

  //! Using Margin Will Affect Cursor Position. Use Padding for now.
  return (
    <>
      <Container
        fluid
        ref={containerRef}
        w={innerWidth - 64}
        h={innerHeight - 108}
      >
        <Container py="xl">
          <Title ta="center">There are {userCount + 1} users in the room</Title>
          <Text ta="center">
            {cursor ? `${cursor.x} x ${cursor.y}` : "Move your cursor"}
          </Text>
          <SimpleGrid cols={1} my="xl">
            <Paper p="xs" withBorder>
              <Text>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi
                dolorum qui accusantium non a quod vel facilis maiores voluptas
                vero aliquam libero id, eius quos excepturi commodi eveniet
                animi repellat?
              </Text>
            </Paper>
            <Paper p="xs" withBorder>
              <Text>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi
                dolorum qui accusantium non a quod vel facilis maiores voluptas
                vero aliquam libero id, eius quos excepturi commodi eveniet
                animi repellat?
              </Text>
            </Paper>
            <Paper p="xs" withBorder>
              <Text>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi
                dolorum qui accusantium non a quod vel facilis maiores voluptas
                vero aliquam libero id, eius quos excepturi commodi eveniet
                animi repellat?
              </Text>
            </Paper>
          </SimpleGrid>
        </Container>
      </Container>
      {cursors.map((cursor) => {
        if (!cursor?.connectionId) return null;
        const { connectionId, x, y } = cursor;

        return (
          <Cursor
            key={connectionId}
            color={String(COLORS[connectionId % COLORS.length])}
            x={x + 32}
            y={y + 76}
          />
        );
      })}
    </>
  );
}
