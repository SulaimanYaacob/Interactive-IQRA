import { Stack, Text } from "@mantine/core";
import { type UserMeta } from "liveblocks.config";

type Props = {
  text?: string;
  info: UserMeta["info"];
  color: string;
  opacity: number;
  x: number;
  y: number;
};

export default function Cursor({ color, x, y, info, opacity, text }: Props) {
  return (
    <Stack
      gap={0}
      pos="absolute"
      opacity={opacity}
      style={{
        zIndex: 1,
        top: 0,
        left: 0,
        borderRadius: "100%",
        transform: `translateX(${x}px) translateY(${y}px)`,
        transition: "transform 0.5s cubic-bezier(.17,.93,.38,1), opacity 0.5s",
      }}
    >
      <svg
        // width="24"
        // height="36"
        // viewBox="0 0 24 36"
        width="18"
        height="20"
        viewBox="0 0 38 46"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        //TODO onMouseEnter make the opacity of the cursor reduced
      >
        {/* <path
        d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
        fill={color}
      /> */}
        <path
          d="M0.235165 4.1836C0.235165 3.48718 0.429095 2.80451 0.795224 2.2121C1.16135 1.61969 1.68522 1.14094 2.30811 0.829494C2.93101 0.518045 3.62833 0.386206 4.32194 0.448748C5.01554 0.51129 5.67803 0.765744 6.23517 1.1836L36.2277 23.6911C39.1077 25.8511 37.5777 30.4411 33.9777 30.4411H19.1764C18.6018 30.4408 18.0348 30.5725 17.5192 30.826C17.0036 31.0796 16.5532 31.4483 16.2027 31.9036L6.95517 43.9598C4.77642 46.8023 0.231415 45.2611 0.231415 41.6761L0.235165 4.1836Z"
          fill={color}
        />
      </svg>
      <Text
        tt="capitalize"
        fw={500}
        c={color}
        inline
        pos="absolute"
        left={25}
        fz="xs"
        style={{
          textShadow: "0px 0px 3px black",
        }}
      >
        {info.username ?? info.name}
      </Text>
      {text && (
        <Text
          style={{
            borderRadius: "10px",
            textShadow: "0px 0px 3px black",
          }}
          bg={color}
          c="white"
          fw={500}
          ml="xs"
          inline
          p="xs"
        >
          {text}
        </Text>
      )}
    </Stack>
  );
}
