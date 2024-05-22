import type { MantineColor } from "@mantine/core";
import { Text } from "@mantine/core";
import { quranFont } from "../utils/nextFont";
import { playIqra1Audio } from "~/utils/iqra-audio";

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
    <>
      <Text
        style={{
          cursor: "pointer",
          letterSpacing: letterSpacing,
          // transition: "1s cubic-bezier(0, 0.52, 1, 1) ",
        }}
        span
        pb={5}
        pt={10}
        ta={align}
        darkHidden
        lts={letterSpacing}
        className={quranFont.className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => playIqra1Audio(word)}
        c={isHighlighted ? "cyan" : "dark"}
        px={{ base: 1, xs: 5, sm: 10, md: 15 }}
        fz={{ base: size * 0.8, xs: size * 0.9, sm: size, md: size * 1.1 }}
        // bg={isHighlighted ? "blue.2" : "transparent"}
      >
        {isNumber ? `(${word})` : ` ${word} `}
      </Text>
      <Text
        span
        pb={5}
        pt={10}
        style={{
          cursor: "pointer",
        }}
        ta={align}
        lightHidden
        lts={letterSpacing}
        className={quranFont.className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => playIqra1Audio(word)}
        c={isHighlighted ? "cyan" : "white"}
        px={{ base: 1, xs: 5, sm: 10, md: 15 }}
        fz={{ base: size * 0.8, xs: size * 0.9, sm: size, md: size * 1.1 }}
      >
        {isNumber ? `(${word})` : ` ${word} `}
      </Text>
    </>
  );
};

export default QuranText;
