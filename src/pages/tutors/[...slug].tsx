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
  Title,
} from "@mantine/core";
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { useRouter } from "next/router";
import { type ReactNode, useState, useEffect } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { appRouter } from "~/server/api/root";
import { api } from "~/utils/api";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { createTRPCContext } from "~/server/api/trpc";
import Loading from "~/components/Loading";

//* Style each group with a border except the last group (Because it alr contain container border)
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

function Tutors({ page, search }: { page: number; search: string }) {
  //TODO Fix Abort Fetching Component Error
  const { push } = useRouter();

  const [activePage, setPage] = useState(Number(page));
  const {
    data: listOfTutors,
    isLoading,
    error,
  } = api.tutor.getTutors.useQuery(
    { search: search ?? "" },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => setPage(Number(page)), [page]);

  //* Define number of tutors to display per page
  return (
    <Container size="sm" my="xl">
      <SimpleGrid my="xs" cols={{ base: 1, xs: 3 }}>
        <TextInput
          defaultValue={search}
          leftSection={<FaMagnifyingGlass />}
          placeholder="Search Tutors"
          onKeyDown={async (e) => {
            if (e.key === "Enter")
              await push(
                `/tutors/1${
                  e.currentTarget.value && `/${e.currentTarget.value}`
                }`
              );
          }}
        />
      </SimpleGrid>
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
    </Container>
  );
}

export default Tutors;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { query } = ctx;
  const { slug } = query as { slug: string[] };
  const ssh = createServerSideHelpers({
    router: appRouter,
    ctx: createTRPCContext({
      req: ctx.req as NextApiRequest,
      res: ctx.res as NextApiResponse,
    }),
    transformer: superjson,
  });

  await ssh.tutor.getTutors.prefetch({ search: slug[1] ?? "" });
  return {
    props: {
      trpcState: JSON.stringify(ssh.dehydrate()),
      page: slug[0],
      search: slug[1] ?? "",
    },
  };
}
