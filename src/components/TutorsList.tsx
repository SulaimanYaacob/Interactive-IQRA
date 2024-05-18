import {
  Paper,
  Stack,
  Group,
  Avatar,
  Anchor,
  Center,
  Pagination,
  Title,
  Text,
} from "@mantine/core";
import { type ReactNode, useState } from "react";
import { api } from "~/utils/api";
import Loading from "./Loading";
import { useRouter } from "next/router";

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

const TutorsList = ({ page, search }: { page: number; search: string }) => {
  const { push } = useRouter();

  const [activePage, setPage] = useState(Number(page));
  const {
    data: listOfTutors,
    isLoading,
    error,
  } = api.tutor.getTutors.useQuery(
    { search: search ?? "" },
    { refetchOnWindowFocus: false }
  );

  return (
    <>
      {listOfTutors && (
        <>
          <Paper withBorder>
            <Stack gap="0">
              {listOfTutors[activePage - 1]?.map(
                ({ firstName, lastName, imageUrl, emailAddresses }, idx) => {
                  const bottomBorder =
                    (listOfTutors[activePage - 1] ?? []).length - 1 === idx
                      ? "none"
                      : "solid";

                  return (
                    <DynamicGroup key={idx} bottomBorder={bottomBorder}>
                      <Group my="xs" ml="md">
                        <Avatar src={imageUrl} color="blue" radius="xl" />
                        <Stack gap="0">
                          <Text fw="500">
                            {`${firstName ?? ""} ${lastName ?? ""}`}
                          </Text>
                          <Text c="dimmed">
                            {emailAddresses[0]?.emailAddress}
                          </Text>
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
              total={listOfTutors.length}
              value={activePage}
              disabled={isLoading}
              onChange={async (e) => {
                setPage(e);
                await push(`/tutors/${e}${search ? `/${String(search)}` : ""}`);
              }}
            />
          </Center>
        </>
      )}
      {/*//******************************** Error Handling  *********************************/}
      {isLoading && <Loading />}

      {!listOfTutors && !isLoading && (
        //TODO Probably just find the name in database instead of using query from clerk
        <Center mih="60vh">
          {/* {search && search.length < 3 ? (
              <Title fw="500">Please enter at least 3 characters</Title>
            ) : ( */}
          <Title>{error?.message ?? "No tutors found"}</Title>
          {/* )} */}
        </Center>
      )}
    </>
  );
};

export default TutorsList;
