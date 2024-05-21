import { Container, SimpleGrid, TextInput } from "@mantine/core";
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { useRouter } from "next/router";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { appRouter } from "~/server/api/root";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { createTRPCContext } from "~/server/api/trpc";
import dynamic from "next/dynamic";

//TODO Use SSG Instead.
const LazyTutorsList = dynamic(
  () => import("~/components/dynamic-components/TutorsList"),
  { ssr: false }
);

//* Style each group with a border except the last group (Because it alr contain container border)

function Tutors({ page, search }: { page: number; search: string }) {
  //TODO Fix Abort Fetching Component Error
  const { push } = useRouter();

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
      <LazyTutorsList page={page} search={search} />
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
