import {
  Center,
  Group,
  Overlay,
  Pagination,
  Stack,
  TextInput,
  Text,
  Divider,
} from "@mantine/core";
import {
  useBroadcastEvent,
  useStorage,
  useMutation,
  useEventListener,
  type RoomEvent,
} from "liveblocks.config";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Cursor from "~/components/Cursor";
import { useElementLiveCursors } from "~/hooks/useElementLiveCursors";
import iqraOneJson from "~/../public/iqra/iqra-1.json";
import IqraContent from "~/components/main-content.tsx/IqraContent";
import CursorText from "~/components/CursorText";
const LiveblocksProvider = dynamic(
  () => import("~/providers/LiveblocksProvider"),
  { ssr: false }
);

const COLORS = [
  "#E57373",
  "#9575CD",
  "#4FC3F7",
  "#81C784",
  "#D3C762",
  "#FF8A65",
  "#F06292",
  "#7986CB",
];

export default function Room() {
  const { query } = useRouter();
  const { roomId } = query as { roomId: string };

  return (
    <LiveblocksProvider roomId={roomId}>
      <InteractiveRoom roomId={roomId} />
    </LiveblocksProvider>
  );
}

function InteractiveRoom({ roomId }: { roomId: string }) {
  document.body.style.overflow = "hidden";
  const broadcast = useBroadcastEvent();
  const [opacity, setOpacity] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const cursors = useElementLiveCursors(roomId, containerRef);
  const [openChat, setOpenChat] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [text, setText] = useState<RoomEvent[]>();
  const [clientText, setClientText] = useState<RoomEvent>();
  const [clienTimeoutId, setClientTimeoutId] = useState<NodeJS.Timeout | null>(
    null
  );

  //**************************** Storage ****************************/
  const page = useStorage((root) => root.page);
  const totalPages = iqraOneJson.length;
  const content = iqraOneJson[page - 1]!;
  const nextPageLink = useMutation(
    ({ storage }, number: number) => {
      storage.set("page", number);
    },
    [page]
  );
  //***************************************************************/

  useEventListener(({ event, connectionId }) => {
    setText((prev) => {
      const updatedText = prev?.map((t) =>
        t.connectionId === connectionId ? event : t
      );

      return [...(updatedText ?? []), { message: event.message, connectionId }];
    });

    if (timeoutId) clearTimeout(timeoutId);

    const id = setTimeout(() => {
      setText((prev) => prev?.filter((t) => t.connectionId !== connectionId));
    }, 5000);

    setTimeoutId(id);
  });

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "/") setOpenChat(true);
      else if (e.key === "Enter") setOpenChat(false);
      else if (e.key === "Escape") {
        setOpenChat(false);
        broadcast({ message: "" });
      }
    }

    document.addEventListener("keyup", handleKey);
    return () => {
      document.removeEventListener("keyup", handleKey);
    };
  }, [broadcast, openChat]);

  return (
    <>
      <Center
        ref={containerRef}
        mih="100vh"
        pos="absolute"
        w="100%"
        p="md"
        top={0}
      >
        {openChat && (
          <Overlay blur={15}>
            <Center pos="absolute" mih="100vh" w="100%">
              <Stack gap="xs" ta="center">
                <Group c="white" justify="center">
                  <Text fw={500}>{`Press "Enter" to Send`}</Text>
                  <Divider orientation="vertical" size="sm" />
                  <Text fw={500}>{`Press "Esc" to Close`}</Text>
                </Group>
                <TextInput
                  placeholder="Say something..."
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      broadcast({ message: e.currentTarget.value });
                      setClientText({
                        message: e.currentTarget.value,
                        connectionId: cursors.selfCursor?.connectionId,
                      });

                      if (clienTimeoutId) clearTimeout(clienTimeoutId);

                      const id = setTimeout(() => {
                        setClientText(undefined);
                      }, 5000);

                      setClientTimeoutId(id);
                    }
                  }}
                />
              </Stack>
            </Center>
          </Overlay>
        )}
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
        {cursors.otherCursors.map((cursor) => {
          if (!cursor?.connectionId) return null;
          const { connectionId, x, y, info } = cursor;

          return (
            <Cursor
              text={
                text?.find((t) => t.connectionId === connectionId)?.message ??
                ""
              }
              opacity={opacity}
              key={connectionId}
              info={info}
              color={String(COLORS[connectionId % COLORS.length])}
              x={x}
              y={y}
            />
          );
        })}

        {/*//! Totally Hardcoded for emergency purposes */}
        {cursors.selfCursor && (
          <CursorText
            text={
              clientText?.connectionId === cursors.selfCursor.connectionId
                ? clientText.message
                : undefined
            }
            opacity={opacity}
            color={String(
              COLORS[cursors.selfCursor.connectionId % COLORS.length]
            )}
            x={cursors.selfCursor.x}
            y={cursors.selfCursor.y}
          />
        )}
      </Center>
    </>
  );
}
