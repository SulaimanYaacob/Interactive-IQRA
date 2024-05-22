import {
  Button,
  Card,
  CardSection,
  Container,
  Image,
  SimpleGrid,
} from "@mantine/core";
import Link from "next/link";

function LearnIQRA() {
  return (
    <Container>
      <SimpleGrid my="xl" cols={{ base: 1, sm: 3 }}>
        <Card padding="md">
          <CardSection>
            <Image
              src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
              height={160}
              alt="Norway"
            />
          </CardSection>
          <Button mt="md" component={Link} href="/st/iqra-1/1">
            IQRA 1
          </Button>
        </Card>
        <Card padding="md">
          <CardSection>
            <Image
              src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
              height={160}
              alt="Norway"
            />
          </CardSection>
          <Button mt="md" component={Link} href="/st/iqra-1/1">
            IQRA 2
          </Button>
        </Card>
        <Card padding="md">
          <CardSection>
            <Image
              src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
              height={160}
              alt="Norway"
            />
          </CardSection>
          <Button mt="md" component={Link} href="/st/iqra-1/1">
            IQRA 3
          </Button>
        </Card>
      </SimpleGrid>
    </Container>
  );
}

export default LearnIQRA;
