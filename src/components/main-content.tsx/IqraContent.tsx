import {
  ActionIcon,
  Alert,
  Box,
  Group,
  type MantineTheme,
  Stack,
  useMatches,
} from "@mantine/core";
import Link from "next/link";
import { type ReactNode, useState } from "react";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";
import QuranText from "./QuranText";

type Props = {
  isInteractive?: {
    onClickNextPage?: () => void;
    onClickPrevPage?: () => void;
    disableNext: boolean;
    disablePrev: boolean;
  };
  nextPageLink?: string;
  prevPageLink?: string;
  content: {
    index: number;
    page: string;
    lines: string[][];
  };
};

const BackgroundTheme = ({ children }: { children: ReactNode }) => {
  const sharedProps = {
    gap: 0,
    px: "lg",
    w: "100%",
    maw: "800px",
    align: "center",
    style: (t: MantineTheme) => ({
      border: `1px solid ${t.colors.gray[3]}`,
    }),
  };

  return (
    <>
      <Stack darkHidden {...sharedProps} pos="relative">
        {children}
      </Stack>
      <Stack lightHidden {...sharedProps} pos="relative">
        {children}
      </Stack>
    </>
  );
};

const IqraContent = ({
  content,
  nextPageLink,
  prevPageLink,
  isInteractive,
}: Props) => {
  const textBoxSpacing = useMatches({
    base: 1,
    xs: "xs",
  });
  const [hoveredWord, setHoveredWord] = useState<string>();
  //TODO If you have time, try to symmetrically align the text.
  return (
    <BackgroundTheme>
      <>
        <ActionIcon
          pos="absolute"
          left="-16px"
          top="50%"
          disabled={isInteractive ? isInteractive.disablePrev : !prevPageLink}
          onClick={isInteractive ? isInteractive.onClickPrevPage : undefined}
          component={!isInteractive ? Link : undefined}
          href={!isInteractive && prevPageLink ? prevPageLink : "#"}
        >
          <MdOutlineChevronLeft size={24} />
        </ActionIcon>
        <ActionIcon
          pos="absolute"
          right="-16px"
          top="50%"
          disabled={isInteractive ? isInteractive.disableNext : !nextPageLink}
          onClick={isInteractive ? isInteractive.onClickNextPage : undefined}
          component={!isInteractive ? Link : undefined}
          href={!isInteractive && nextPageLink ? nextPageLink : "#"}
        >
          <MdOutlineChevronRight size={24} />
        </ActionIcon>
      </>

      {content?.lines.map((line, lineIdx) => {
        const isRomanText =
          line.length === 1 && !!line[0]?.match(/[aeiou]/gi)?.length;
        const isSingleColumn = line.length === 1;

        return !isRomanText ? (
          <Box w="100%" key={`line-${lineIdx}`}>
            <Group
              gap="xs"
              py={{ base: "xs", xs: "sm" }}
              justify={isSingleColumn ? "center" : "space-between"}
              style={(t) => ({
                flexDirection: "row-reverse",
                borderBottom:
                  lineIdx + 1 !== content.lines.length
                    ? `1px solid ${t.colors.gray[3]}`
                    : "none",
              })}
            >
              {line.map((cell, cellIdx) => {
                const isDoubleColumn = line.length === 2;

                //! Currently Harcoded for IQRA 1
                const hasColumnLengthDiff =
                  isDoubleColumn && cell.split(" ").length > 4
                    ? "45%"
                    : cell.split(" ").length === 4
                    ? "35%"
                    : "25%";

                return (
                  <Box
                    w={isSingleColumn ? "auto" : hasColumnLengthDiff}
                    key={`${cellIdx}-${lineIdx}`}
                  >
                    <Group
                      grow
                      gap={textBoxSpacing}
                      style={{ flexDirection: "row-reverse" }}
                    >
                      {cell.split(" ").map((word, wordIdx) => {
                        const key = `line-${lineIdx}-cell-${cellIdx}-word-${wordIdx}`;
                        return (
                          <QuranText
                            size={30}
                            key={key}
                            word={word}
                            align="center"
                            isHighlighted={hoveredWord === key}
                            handleMouseEnter={() => setHoveredWord(key)}
                            handleMouseLeave={() => setHoveredWord(undefined)}
                          />
                        );
                      })}
                    </Group>
                  </Box>
                );
              })}
            </Group>
          </Box>
        ) : (
          <Alert ta="center" key={`line-${lineIdx}`}>
            <QuranText word={line[0] ?? ""} size={20} />
          </Alert>
        );
      })}
    </BackgroundTheme>
  );
};

export default IqraContent;
