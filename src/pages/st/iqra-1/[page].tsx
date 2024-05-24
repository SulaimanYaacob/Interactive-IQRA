import { Center, Pagination } from "@mantine/core";
import IqraContent from "~/components/main-content.tsx/IqraContent";
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

      <Center pos="absolute" mih="100vh" w="100%" top={0} p="md">
        {content && (
          <IqraContent
            nextPageLink={
              page === totalPages ? undefined : `/st/iqra-1/${page + 1}`
            }
            prevPageLink={page === 1 ? undefined : `/st/iqra-1/${page - 1} `}
            content={content}
          />
        )}
        <Pagination
          bottom={25}
          pos="absolute"
          visibleFrom="xs"
          value={page || 1}
          total={totalPages}
          onChange={(number) => push(`/st/iqra-1/${number}`)}
        />
        <Pagination
          size="sm"
          bottom={25}
          pos="absolute"
          hiddenFrom="xs"
          value={page || 1}
          total={totalPages}
          onChange={(number) => push(`/st/iqra-1/${number}`)}
        />
      </Center>
    </>
  );
};

export default IqraPage;

export const getStaticProps = ({ params }: GetStaticPropsContext) => {
  try {
    const page = Number((params?.page ?? "1") as string);
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
