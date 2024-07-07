import { Stack, Text } from "@mantine/core";

type Props = {
  text?: string;
  color: string;
  opacity: number;
  x: number;
  y: number;
};

export default function CursorText({ color, x, y, opacity, text }: Props) {
  return (
    <Stack
      gap={0}
      pos="absolute"
      opacity={opacity}
      style={{
        zIndex: 1,
        top: 0,
        left: 10,
        borderRadius: "100%",
        transform: `translateX(${x}px) translateY(${y}px)`,
        transition: "transform 0.5s cubic-bezier(.17,.93,.38,1), opacity 0.5s",
      }}
    >
      {text && (
        <Text
          mt="20px"
          style={{
            borderRadius: "10px",
            textShadow: "0px 0px 3px black",
          }}
          bg={color}
          c="white"
          fw={500}
          mr="xs"
          inline
          p="xs"
        >
          {text}
        </Text>
      )}
    </Stack>
  );
}
