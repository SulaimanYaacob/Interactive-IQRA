import { useEffect, useState } from "react";
import { useOthers, useUpdateMyPresence } from "liveblocks.config";

export default function useWindowLiveCursors() {
  const updateMyPresence = useUpdateMyPresence();
  const [lastPosition, setLastPosition] = useState<{ x: number; y: number }>();
  useEffect(() => {
    const scroll = { x: window.scrollX, y: window.scrollY };

    function transformPosition(point: { x: number; y: number }) {
      return {
        x: point.x / window.innerWidth,
        y: point.y,
      };
    }

    function onPointerMove(event: PointerEvent) {
      const position = {
        x: Math.round(event.clientX),
        y: Math.round(event.clientY),
      };

      setLastPosition(position);

      updateMyPresence({
        cursor: transformPosition(position),
      });
    }

    function onPointerLeave() {
      setLastPosition(undefined);
      updateMyPresence({ cursor: null });
    }

    function onDocumentScroll() {
      if (lastPosition) {
        const offsetX = window.scrollX - scroll.x;
        const offsetY = window.scrollY - scroll.y;
        const position = {
          x: lastPosition.x + offsetX,
          y: lastPosition.y + offsetY,
        };
        setLastPosition(position);
        updateMyPresence({
          cursor: transformPosition(position),
        });
      }
      scroll.x = window.scrollX;
      scroll.y = window.scrollY;
    }

    document.addEventListener("scroll", onDocumentScroll);
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerleave", onPointerLeave);

    return () => {
      document.removeEventListener("scroll", onDocumentScroll);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [lastPosition, updateMyPresence]);

  const others = useOthers();

  return others
    .filter((user) => user.presence?.cursor != null)
    .map(({ connectionId, presence, id, info }) => {
      return {
        x: presence.cursor!.x * window.innerWidth,
        y: presence.cursor!.y,
        connectionId,
        id,
        info,
        presence,
      };
    });
}
