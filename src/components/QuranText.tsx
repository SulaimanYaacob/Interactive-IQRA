import type { MantineColor } from "@mantine/core";
import { Box, Text } from "@mantine/core";
import { quranFont } from "../utils/nextFont";

// TODO: Padding control
type Props = {
  word: string;
  isHighlighted?: boolean;
  handleMouseEnter?: () => void;
  handleMouseLeave?: () => void;
  highlightColor?: MantineColor;
  align?: "center" | "left" | "right";
  isNumber?: boolean;
  size?: number;
  letterSpacing?: number | string;
};

const QuranText = ({
  word,
  align = "right",
  isHighlighted,
  handleMouseEnter,
  handleMouseLeave,
  highlightColor,
  size = 26,
  isNumber,
  letterSpacing = 0.5,
}: Props) => {
  return (
    <Box px={{ xs: 3 }} fz={{ xs: size * 0.8 }}>
      <Text
        className={quranFont.className}
        fz={{ base: 26 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        span
        ta={align}
        px="sm"
        pb={5}
        pt={10}
        style={{
          letterSpacing: letterSpacing,
          cursor: "pointer",
          transition: "1s cubic-bezier(0, 0.52, 1, 1) ",
          ":hover": {
            transitionDuration: "0.2s",
          },
        }}
        // color={isHighlighted ? 'blue.6' : 'dark'}
        bg={isHighlighted ? "blue.2" : "transparent"}
      >
        {isNumber ? `(${word})` : ` ${word} `}
      </Text>
    </Box>
  );
};

export default QuranText;
