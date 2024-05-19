import { clerkClient } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/dist/types/server";
import {
  Avatar,
  Container,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import type { GetStaticPropsContext } from "next";

const Profile = ({ user }: { user: User }) => {
  return (
    <Container my="xl">
      <Paper p="xl" withBorder>
        <Stack gap="xl">
          <Group justify="space-evenly">
            <Group justify="start">
              <Avatar src={user.imageUrl} alt={user.imageUrl} size="xl" />
              <div>
                <Title order={2}>
                  {user.firstName ?? "" + user.lastName ?? ""}
                </Title>
                <Text c="dimmed">{user.emailAddresses[0]?.emailAddress}</Text>
              </div>
            </Group>
            <Divider orientation="vertical" />
            <Group>
              <div>
                <Text c="dimmed">{user.emailAddresses[0]?.emailAddress}</Text>
              </div>
            </Group>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Profile;

export const getStaticProps = async ({
  params,
}: GetStaticPropsContext<{ userId: string }>) => {
  try {
    const userId = String(params?.userId);
    const user = await clerkClient.users.getUser(userId);

    return {
      props: { user: JSON.parse(JSON.stringify(user)) as User },
    };
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
