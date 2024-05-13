import {
  Anchor,
  Avatar,
  Center,
  Container,
  Group,
  Loader,
  Pagination,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useRouter } from "next/router";
import { type ReactNode, useState, useEffect } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { api } from "~/utils/api";

function chunk<T>(array: T[], size: number): T[][] {
  if (!array.length) {
    return [];
  }
  const head = array.slice(0, size);
  const tail = array.slice(size);
  return [head, ...chunk(tail, size)];
}

//* Desperate Measures
const DynamicGroup = ({
  children,
  bottomBorder,
}: {
  children: ReactNode;
  bottomBorder: string;
}) => {
  return (
    <>
      <Group
        justify="space-between"
        style={(theme) => ({
          borderBottom: `1px ${bottomBorder} ${theme.colors.gray[3]}`,
        })}
        darkHidden
      >
        {children}
      </Group>
      <Group
        justify="space-between"
        style={(theme) => ({
          borderBottom: `1px ${bottomBorder} ${theme.colors.gray[7]}`,
        })}
        lightHidden
      >
        {children}
      </Group>
    </>
  );
};

function Tutors() {
  const { query, push } = useRouter();
  const { page } = query;

  const [activePage, setPage] = useState(Number(page));
  const { data: tutors } = api.tutor.getTutors.useQuery();

  useEffect(() => {
    setPage(Number(page));
  }, [page]);

  if (!tutors)
    return (
      <Center mih="80vh">
        <Loader />
      </Center>
    );

  //* Define number of tutors to display per page
  const chunkedListOfTutors = chunk(tutors, 5);

  return (
    <Container size="sm" my="xl">
      <SimpleGrid my="xs" cols={{ base: 1, xs: 3 }}>
        <TextInput
          leftSection={<FaMagnifyingGlass />}
          placeholder="Search Tutors"
        />
      </SimpleGrid>
      <Paper withBorder>
        <Group></Group>
        <Stack gap="0">
          {chunkedListOfTutors[activePage - 1]?.map(
            ({ firstName, lastName, imageUrl }, idx) => {
              const bottomBorder =
                (chunkedListOfTutors[activePage - 1] ?? []).length - 1 === idx
                  ? "none"
                  : "solid";

              return (
                <DynamicGroup key={idx} bottomBorder={bottomBorder}>
                  <Group my="xs" ml="md">
                    <Avatar src={imageUrl} color="blue" radius="xl" />
                    <Stack gap="0">
                      <Text fw="500">{`${firstName} + ${lastName}`}</Text>
                      <Text c="dimmed"></Text>
                    </Stack>
                  </Group>
                  <Anchor fw="500" td="none" mr="md">
                    View
                  </Anchor>
                </DynamicGroup>
              );
            }
          )}
        </Stack>
      </Paper>
      <Center my="xl">
        <Pagination
          total={chunkedListOfTutors.length}
          value={activePage}
          onChange={async (e) => {
            setPage(e);
            await push(`/tutors?page=${e}`);
          }}
        />
      </Center>
    </Container>
  );
}

export default Tutors;
