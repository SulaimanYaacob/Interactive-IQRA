import { Center, Container, Stack, Text, Title } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { useMyPresence, useOthers } from "liveblocks.config";
import dynamic from "next/dynamic";
import Cursor from "~/components/Cursor";
import useWindowLiveCursors from "~/hooks/useWindowLiveCursors";
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

//! Currently not finished! The cursor is applied to the entire screen
export default function Rooms() {
  return (
    <LiveblocksProvider>
      <InteractiveIqra />
    </LiveblocksProvider>
  );
}

function InteractiveIqra() {
  const others = useOthers();
  const userCount = others.length;
  const [{ cursor }] = useMyPresence();
  const { height, width } = useViewportSize();
  const cursors = useWindowLiveCursors();

  return (
    <Container
      fluid
      // h={height - 76}
      // w={width}
      p="xl"
      // onPointerMove={(e) => {
      //   updateMyPresence({
      //     cursor: {
      //       x: Math.round(e.clientX),
      //       y: Math.round(e.clientY),
      //     },
      //   });
      // }}
      // onPointerLeave={() => updateMyPresence({ cursor: null })}
    >
      <Stack py="xl">
        <Title ta="center">There are {userCount + 1} users in the room</Title>
        <Text ta="center">{cursor && `${cursor.x} x ${cursor.y}`}</Text>
      </Stack>
      <Center>
        {cursors.map(({ connectionId, x, y }) => {
          return (
            <Cursor
              key={connectionId}
              color={COLORS[connectionId % COLORS.length]!}
              x={x}
              y={y}
            />
          );
        })}
      </Center>
    </Container>
  );
}
