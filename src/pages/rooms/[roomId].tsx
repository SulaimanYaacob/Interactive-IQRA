import { Center, Container, Stack, Text, Title } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { useMyPresence, useOthers } from "liveblocks.config";
import dynamic from "next/dynamic";
import Cursor from "~/components/Cursor";
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
      <InteractiveIqra />
    </LiveblocksProvider>
  );
}

function InteractiveIqra() {
  const others = useOthers();
  const userCount = others.length;
  const [{ cursor }, updateMyPresence] = useMyPresence();
  const { height, width } = useViewportSize();

  return (
    <Container
      fluid
      h={height - 80}
      w={width}
      onPointerMove={(e) => {
        updateMyPresence({
          cursor: {
            x: Math.round(e.clientX),
            y: Math.round(e.clientY),
          },
        });
      }}
      onPointerLeave={() => updateMyPresence({ cursor: null })}
    >
      <Stack py="xl">
        <Title ta="center">There are {userCount + 1} users in the room</Title>
        <Text ta="center">
          {cursor &&
            `${(cursor.x / width) * 100} x ${(cursor.y / height) * 100}`}
        </Text>
      </Stack>

      <Center>
        {others.map(({ connectionId, presence }) => {
          if (!presence.cursor) return null;

          return (
            <Cursor
              key={connectionId}
              color={COLORS[connectionId % COLORS.length]!}
              x={presence.cursor.x}
              y={presence.cursor.y}
            />
          );
        })}
      </Center>
    </Container>
  );
}
