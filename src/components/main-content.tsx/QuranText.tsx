import type { MantineColor } from "@mantine/core";
import { Text } from "@mantine/core";
import { quranFont } from "../../utils/nextFont";
import { playIqra1Audio } from "~/utils/iqra-audio";

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
  //Props
  const TextProps = {
    pb: 5,
    pt: 10,
    ta: align,
    span: true,
    lts: letterSpacing,
    style: { cursor: "pointer" },
    className: quranFont.className,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onClick: () => playIqra1Audio(word),
    px: { base: 0, xs: 5, sm: 10, md: 15 },
    fz: { base: size * 0.8, xs: size * 0.9, sm: size, xl: size * 1.1 },
  };

  return (
    <>
      <Text darkHidden c={isHighlighted ? "cyan" : "dark"} {...TextProps}>
        {isNumber ? `(${word})` : ` ${word} `}
      </Text>
      <Text lightHidden c={isHighlighted ? "cyan" : "white"} {...TextProps}>
        {isNumber ? `(${word})` : ` ${word} `}
      </Text>
    </>
  );
};

export default QuranText;
