import {
  Container,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { useMyPresence, useOthers } from "liveblocks.config";
import dynamic from "next/dynamic";
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

export default function Rooms() {
  return (
    <LiveblocksProvider>
      <InteractiveRoom id="room" />
    </LiveblocksProvider>
  );
}

function InteractiveRoom({ id }: { id: string }) {
  const others = useOthers();
  const userCount = others.length;
  const [{ cursor }] = useMyPresence();

  const { width, height } = useViewportSize();
  const containerRef = useRef<HTMLDivElement>(null);
  const cursors = useElementLiveCursors(id, containerRef);

  return (
    <>
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
      <Container ref={containerRef} fluid w={width - 64} h={height - 108}>
        <Stack py="xl">
          <Title ta="center">There are {userCount + 1} users in the room</Title>
          <Text ta="center">
            {cursor ? `${cursor.x} x ${cursor.y}` : "Move your cursor"}
          </Text>
        </Stack>
        <SimpleGrid cols={1} my="xl">
          <Paper p="xs" withBorder>
            <Text>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi
              dolorum qui accusantium non a quod vel facilis maiores voluptas
              vero aliquam libero id, eius quos excepturi commodi eveniet animi
              repellat?
            </Text>
          </Paper>
          <Paper p="xs" withBorder>
            <Text>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi
              dolorum qui accusantium non a quod vel facilis maiores voluptas
              vero aliquam libero id, eius quos excepturi commodi eveniet animi
              repellat?
            </Text>
          </Paper>
          <Paper p="xs" withBorder>
            <Text>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi
              dolorum qui accusantium non a quod vel facilis maiores voluptas
              vero aliquam libero id, eius quos excepturi commodi eveniet animi
              repellat?
            </Text>
          </Paper>
        </SimpleGrid>
      </Container>
    </>
  );
}
