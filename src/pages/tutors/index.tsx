import {
  Anchor,
  Avatar,
  Center,
  Container,
  Group,
  Pagination,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  useMantineColorScheme,
} from "@mantine/core";
import { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

const listOfTutors = [
  {
    name: "John Doe",
    country: "USA",
    state: "California",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80",
  },
  {
    name: "John Doe",
    country: "USA",
    state: "California",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80",
  },
  {
    name: "John Doe",
    country: "USA",
    state: "California",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80",
  },
  {
    name: "John Doe",
    country: "USA",
    state: "California",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80",
  },
  {
    name: "John Doe",
    country: "USA",
    state: "California",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80",
  },
  {
    name: "Alissa",
    country: "USA",
    state: "Indianapolis",
    image: "https://randomuser.me/api/portraits/women/24.jpg",
  },
  {
    name: "Alissa",
    country: "USA",
    state: "Indianapolis",
    image: "https://randomuser.me/api/portraits/women/24.jpg",
  },
  {
    name: "Alissa",
    country: "USA",
    state: "Indianapolis",
    image: "https://randomuser.me/api/portraits/women/24.jpg",
  },
  {
    name: "Alissa",
    country: "USA",
    state: "Indianapolis",
    image: "https://randomuser.me/api/portraits/women/24.jpg",
  },
  {
    name: "Alissa",
    country: "USA",
    state: "Indianapolis",
    image: "https://randomuser.me/api/portraits/women/24.jpg",
  },
];

function chunk<T>(array: T[], size: number): T[][] {
  if (!array.length) {
    return [];
  }
  const head = array.slice(0, size);
  const tail = array.slice(size);
  return [head, ...chunk(tail, size)];
}

const chunkedListOfTutors = chunk(listOfTutors, 6);

function Tutors() {
  const { colorScheme } = useMantineColorScheme();
  const [activePage, setPage] = useState(1);

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
            ({ country, image, name, state }, idx) => {
              return (
                <Group
                  style={(theme) => ({
                    borderBottom: `1px ${
                      listOfTutors.length - 1 === idx ? "none" : "solid"
                    } ${theme.colors.gray[colorScheme === "dark" ? 7 : 3]}`,
                  })}
                  justify="space-between"
                  key={idx}
                >
                  <Group my="xs" ml="md">
                    <Avatar src={image} color="blue" radius="xl" />
                    <Stack gap="0">
                      <Text fw="500">{name}</Text>
                      <Text c="dimmed">
                        {state}, {country}
                      </Text>
                    </Stack>
                  </Group>
                  <Anchor td="none" mr="md">
                    View Profile
                  </Anchor>
                </Group>
              );
            }
          )}
        </Stack>
      </Paper>
      <Center my="xl">
        <Pagination
          total={chunkedListOfTutors.length}
          value={activePage}
          onChange={setPage}
        />
      </Center>
    </Container>
  );
}

export default Tutors;
