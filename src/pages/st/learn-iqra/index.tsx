import { useSession } from "@clerk/nextjs";
import {
  Button,
  Card,
  CardSection,
  Container,
  Image,
  SimpleGrid,
} from "@mantine/core";
import Link from "next/link";
import { FaLock } from "react-icons/fa6";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";

const iqraList = [
  {
    productName: "iqra 1",
    disabled: false,
  },
  {
    productName: "iqra 2",
    disabled: true,
  },
  {
    productName: "iqra 3",
    disabled: true,
  },
];

function LearnIQRA() {
  const { isLoaded, session } = useSession();
  const {
    data: productSessions,
    isLoading,
    isFetched,
  } = api.stripe.getIqraProductCheckoutURL.useQuery(undefined, {
    enabled: isLoaded,
    placeholderData: [
      {
        productName: "iqra 1",
        paid: true,
        checkoutUrl: "/st/iqra-1/1",
      },
      {
        productName: "iqra 2",
        paid: false,
        checkoutUrl: null,
      },
      {
        productName: "iqra 3",
        paid: false,
        checkoutUrl: null,
      },
    ],
  });

  if (isLoading) return <Loading />;

  if (!session)
    return (
      <Container>
        <SimpleGrid my="xl" cols={{ base: 1, sm: 3 }}>
          {iqraList.map(({ productName, disabled }, index) => {
            return (
              <Card key={productName} tt="uppercase" padding="md">
                <CardSection>
                  <Image
                    src="https://html.scribdassets.com/9plgc5srpc26892h/images/1-2464e1e7a3.jpg"
                    height={160}
                    alt="iqra"
                  />
                </CardSection>
                {disabled ? (
                  <Button
                    leftSection={<FaLock />}
                    tt="uppercase"
                    disabled
                    mt="md"
                  >
                    {productName}
                  </Button>
                ) : (
                  <Button
                    mt="md"
                    component={Link}
                    href={`/st/iqra-${++index}/1`}
                  >
                    {productName}
                  </Button>
                )}
              </Card>
            );
          })}
        </SimpleGrid>
      </Container>
    );

  return (
    <Container>
      <SimpleGrid my="xl" cols={{ base: 1, sm: 3 }}>
        {productSessions?.map(({ paid, checkoutUrl, productName }, index) => {
          return (
            <Card key={productName} tt="uppercase" padding="md">
              <CardSection>
                <Image
                  src="https://html.scribdassets.com/9plgc5srpc26892h/images/1-2464e1e7a3.jpg"
                  height={160}
                  alt="iqra"
                />
              </CardSection>
              {paid ? (
                <Button mt="md" component={Link} href={`/st/iqra-${++index}/1`}>
                  {productName}
                </Button>
              ) : (
                <Button
                  mt="md"
                  loading={!isFetched}
                  leftSection={<FaLock />}
                  component={Link}
                  href={checkoutUrl ?? ""}
                >
                  Purchase {productName}
                </Button>
              )}
            </Card>
          );
        })}
      </SimpleGrid>
    </Container>
  );
}

export default LearnIQRA;
