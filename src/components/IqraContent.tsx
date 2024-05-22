import { ActionIcon, Box, Group, Stack, useMatches } from "@mantine/core";
import QuranText from "./QuranText";
import Link from "next/link";
import { useState } from "react";
import { MdOutlineChevronLeft, MdOutlineChevronRight } from "react-icons/md";

type Props = {
  page: number;
  nextPageLink?: string;
  prevPageLink?: string;
  content: {
    index: number;
    page: string;
    lines: string[][];
  };
};

//TODO Add Audio
const IqraContent = ({ page, content, nextPageLink, prevPageLink }: Props) => {
  const textBoxSpacing = useMatches({
    base: 1,
    xs: "xs",
  });
  const [hoveredWord, setHoveredWord] = useState<string>();
  return (
    <>
      <Stack
        gap={0}
        px="lg"
        bg="white"
        maw="800px"
        w="100%"
        pos="relative"
        align="center"
        style={(t) => ({
          border: `1px solid ${t.colors.gray[3]}`,
        })}
      >
        <ActionIcon
          pos="absolute"
          variant="filled"
          left="-16px"
          top="50%"
          component={Link}
          disabled={!prevPageLink}
          href={prevPageLink ?? "#"}
        >
          <MdOutlineChevronLeft size={24} />
        </ActionIcon>
        <ActionIcon
          pos="absolute"
          variant="filled"
          right="-16px"
          top="50%"
          component={Link}
          disabled={!nextPageLink}
          href={nextPageLink ?? "#"}
        >
          <MdOutlineChevronRight size={24} />
        </ActionIcon>

        {content?.lines.map((line, lineIdx) => {
          const isRomanText =
            line.length === 1 && !!line[0]?.match(/[aeiou]/gi)?.length;
          const isSingleColumn = line.length === 1;

          return !isRomanText ? (
            <Box w="100%" key={`line-${lineIdx}`}>
              <Group
                py={{ base: "xs", xs: "sm" }}
                gap="xs"
                w="100%"
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
                  return (
                    <Box key={`${cellIdx}-${lineIdx}`}>
                      <Group
                        style={{ flexDirection: "row-reverse" }}
                        gap={textBoxSpacing}
                      >
                        {cell.split(" ").map((word, wordIdx) => {
                          const key = `line-${lineIdx}-cell-${cellIdx}-word-${wordIdx}`;
                          return (
                            <QuranText
                              align="center"
                              size={30}
                              isHighlighted={hoveredWord === key}
                              handleMouseEnter={() => setHoveredWord(key)}
                              handleMouseLeave={() => setHoveredWord(undefined)}
                              key={key}
                              word={word}
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
            <QuranText
              key={`line-${lineIdx}`}
              align="center"
              word={line[0] ?? ""}
              size={20}
            />
          );
        })}
      </Stack>
    </>
  );
};

export default IqraContent;

// const characterCountToSpacingMapper = (count: number) => {
//   let spacing = "2vw";
//   if (count < 10) {
//     spacing = "2.5vw";
//   } else if (count < 14) {
//     spacing = "2vw";
//   }

//   return spacing;
// };
