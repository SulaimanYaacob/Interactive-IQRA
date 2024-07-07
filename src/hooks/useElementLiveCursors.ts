import { useOthers, useSelf, useUpdateMyPresence } from "liveblocks.config";
import { type RefObject, useEffect, useState } from "react";

export function useElementLiveCursors(id: string, ref: RefObject<HTMLElement>) {
  //? Use window's viewport instead of mantine's useViewPort (It takes time to render and cause the UI to render container's viewport)

  const [boundingRect, setBoundingRect] = useState<DOMRect>();
  const updateMyPresence = useUpdateMyPresence();
  const self = useSelf();
  const others = useOthers();

  useEffect(() => {
    if (ref.current) setBoundingRect(ref.current.getBoundingClientRect());
  }, [ref]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    function getCursorPositionFromBoundingRect(
      e: MouseEvent,
      boundingRect: DOMRect
    ) {
      return {
        x: (e.clientX - boundingRect.left) / boundingRect.width,
        y: (e.clientY - boundingRect.top) / boundingRect.height,
      };
    }

    function onMouseMove(e: MouseEvent) {
      if (!boundingRect) return;

      const cursor = getCursorPositionFromBoundingRect(e, boundingRect);
      updateMyPresence({
        cursor,
      });
    }

    function onMouseEnter() {
      updateMyPresence({
        elementId: id,
      });
      setBoundingRect(element!.getBoundingClientRect());
    }

    function onMouseLeave() {
      updateMyPresence({
        elementId: null,
        cursor: null,
      });
    }

    function handleResize() {
      setBoundingRect(ref.current?.getBoundingClientRect());
    }

    element.addEventListener("mousemove", onMouseMove);
    element.addEventListener("mouseenter", onMouseEnter);
    element.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize", handleResize);

    return () => {
      element.removeEventListener("mousemove", onMouseMove);
      element.removeEventListener("mouseenter", onMouseEnter);
      element.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, [id, ref, updateMyPresence, boundingRect]);

  const otherCursors = others
    .filter(
      (user) =>
        user.presence?.cursor != null &&
        user.presence?.elementId != null &&
        user.presence?.elementId === id
    )
    .map(({ connectionId, presence, id, info }) => {
      if (!boundingRect) return null;
      if (presence.cursor == null) return null;

      return {
        id,
        info,
        presence,
        connectionId,
        x: presence.cursor.x * boundingRect.width,
        y: presence.cursor.y * boundingRect.height,
      };
    });

  const selfCursor = self.presence?.cursor
    ? {
        id: self.id,
        info: self.info,
        presence: self.presence,
        connectionId: self.connectionId,
        x: self.presence.cursor.x * boundingRect!.width,
        y: self.presence.cursor.y * boundingRect!.height,
      }
    : null;

  return { otherCursors, selfCursor };
}
