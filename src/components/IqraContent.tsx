import { ActionIcon, Box, Container, Group, Stack } from "@mantine/core";
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

const IqraContent = ({ page, content, nextPageLink, prevPageLink }: Props) => {
  const [hoveredWord, setHoveredWord] = useState<string>();
  return (
    <Container>
      <Stack
        w="100%"
        align="center"
        px="lg"
        bg="white"
        gap={0}
        pos="relative"
        style={(t) => ({
          border: `1px solid ${t.colors.gray[3]}`,
        })}
      >
        <ActionIcon
          pos="absolute"
          variant="filled"
          left={-16}
          top="48%"
          size="lg"
          component={Link}
          disabled={!prevPageLink}
          href={prevPageLink ?? "#"}
          color={"blue"}
        >
          <MdOutlineChevronLeft size={20} />
        </ActionIcon>
        <ActionIcon
          pos="absolute"
          variant="filled"
          right={-16}
          top="48%"
          component={Link}
          disabled={!nextPageLink}
          href={nextPageLink ?? "#"}
          color={"blue"}
        >
          <MdOutlineChevronRight size={20} />
        </ActionIcon>

        {content?.lines.map((line, lineIdx) => {
          const isRomanText =
            line.length === 1 && !!line[0]?.match(/[aeiou]/gi)?.length;
          const isSingleColumn = line.length === 1;

          const charactersPerLine =
            line
              .flatMap((item) => item)
              .join("")
              .replace(/ /g, "").length / 2; // * divided by 2 because
          const spacing = characterCountToSpacingMapper(charactersPerLine);

          return !isRomanText ? (
            <Box
              w="100%"
              key={`line-${lineIdx}`}
              py={{ xs: "xs" }}
              style={{ gap: 0 }}
            >
              <Group
                py="md"
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
                    <Box
                      key={`${cellIdx}-${lineIdx}`}
                      style={{ gap: 0 }}
                      // smallerThan="xs"
                      // styles={{ gap: 0 }}
                    >
                      <Group
                        style={{ gap: spacing, flexDirection: "row-reverse" }}
                        gap={0}
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
    </Container>
  );
};

export default IqraContent;

const characterCountToSpacingMapper = (count: number) => {
  let spacing = "2vw";
  if (count < 10) {
    spacing = "2.5vw";
  } else if (count < 14) {
    spacing = "2vw";
  }
  return spacing;
};
