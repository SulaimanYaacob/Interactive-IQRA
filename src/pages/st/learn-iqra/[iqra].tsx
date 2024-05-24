import { Container, Paper, Stack, Title } from "@mantine/core";
import { useRouter } from "next/router";
import iqraOne from "public/iqra/iqra-1.json";
import { useEffect, useState } from "react";
import { quranFont } from "~/utils/nextFont";

//* This should be a component instead to reuse it in rooms page
function Iqra() {
  const { query } = useRouter();
  const { iqra } = query;

  const [selectedIqra, setSelectedIqra] = useState(iqraOne);

  useEffect(() => {
    if (iqra === "1") setSelectedIqra(iqraOne);
  }, [iqra]);

  if (!iqra) return null;

  if (iqra !== "1")
    return (
      <Container my="xl">
        <Title>IQRA-{iqra} does not exists</Title>
      </Container>
    );

  //! Might not be that easy
  return (
    <Container my="sm">
      <Stack ta="center">
        <Title ta="center">Current Iqra: {iqra}</Title>
        <Paper p="xs" withBorder>
          {selectedIqra.map(
            ({ lines, page }) =>
              page === "page1" && (
                <>
                  {lines.map((line, idx) => {
                    return (
                      <>
                        <Title className={quranFont.className} key={idx}>
                          {line}
                        </Title>
                      </>
                    );
                  })}
                </>
              )
          )}
        </Paper>
      </Stack>
    </Container>
  );
}

export default Iqra;
