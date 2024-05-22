import type { MantineColor } from "@mantine/core";
import { Text } from "@mantine/core";
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
    <Text
      className={quranFont.className}
      fz={{ base: size * 0.8, xs: size * 0.9, sm: size, md: size * 1.1 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      span
      ta={align}
      px={{ base: 1, xs: 3 }}
      pb={5}
      pt={10}
      style={{
        letterSpacing: letterSpacing,
        cursor: "pointer",
        // transition: "1s cubic-bezier(0, 0.52, 1, 1) ",
      }}
      c={isHighlighted ? "cyan" : "dark"}
      // bg={isHighlighted ? "blue.2" : "transparent"}
    >
      {isNumber ? `(${word})` : ` ${word} `}
    </Text>
  );
};

export default QuranText;
