import {
  Button,
  Card,
  CardSection,
  Container,
  Image,
  SimpleGrid,
} from "@mantine/core";

function LearnIQRA() {
  return (
    <Container>
      <SimpleGrid my="xl" cols={3}>
        <Card padding="md">
          <CardSection>
            <Image
              src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
              height={160}
              alt="Norway"
            />
          </CardSection>
          <Button mt="md">IQRA 1</Button>
        </Card>
      </SimpleGrid>
    </Container>
  );
}

export default LearnIQRA;
