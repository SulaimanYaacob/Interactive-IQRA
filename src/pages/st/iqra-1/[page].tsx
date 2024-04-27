import { Box, Pagination, Stack } from "@mantine/core";
import IqraContent from "~/components/IqraContent";
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { useRouter } from "next/router";
import iqraOneJson from "../../../../public/iqra/iqra-1.json";

const IqraPage = ({
  page,
  content,
  totalPages,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { push } = useRouter();
  return (
    <>
      {/* <NextSeo title="Talaqqi | Iqra 1" /> */}
      <Stack align={"center"} gap="xl" p="md">
        {content && (
          <IqraContent
            page={page}
            nextPageLink={
              page === totalPages ? "/st/iqra-2/1" : `/st/iqra-1/${page + 1}`
            }
            prevPageLink={page === 1 ? undefined : `/st/iqra-1/${page - 1} `}
            content={content}
          />
        )}
        <Box visibleFrom="xs">
          <Pagination
            defaultValue={page || 1}
            onChange={(number) => push(`/st/iqra-1/${number}`)}
            total={totalPages}
          />
        </Box>
        <Box display={{ xs: "flex" }}>
          <Pagination
            display="none"
            size="sm"
            defaultValue={page || 1}
            onChange={(number) => push(`/st/iqra-1/${number}`)}
            total={totalPages}
          />
        </Box>
      </Stack>
    </>
  );
};

export default IqraPage;

export const getStaticProps = ({ params }: GetStaticPropsContext) => {
  const page = Number((params?.page ?? "1") as string);

  // TODO: handle last page

  try {
    const content = iqraOneJson[page - 1];
    const totalPages = iqraOneJson.length;
    return {
      props: {
        page,
        content,
        totalPages,
      },
      revalidate: 30,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export const getStaticPaths: GetStaticPaths = () => {
  const initialPages = 5;
  return {
    paths: Array(initialPages) // * initially trying to render all 604 pages but it hits the request limit
      .fill("")
      .map((element, index) => ({ params: { page: (index + 1).toString() } })),
    fallback: "blocking",
  };
};
