import { clerkClient } from "@clerk/nextjs/server";
import { type User } from "@clerk/nextjs/dist/types/server";
import {
  Accordion,
  Avatar,
  Badge,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import type { GetStaticPropsContext } from "next";
import type { ROLE } from "~/utils/constants";
import dynamic from "next/dynamic";
const LazyProfileButton = dynamic(
  () => import("~/components/dynamic-components/ProfileButton"),
  { ssr: false }
);

const Profile = ({ user }: { user: User }) => {
  const role = user.publicMetadata.role as ROLE;

  return (
    <Container my="xl">
      <Stack>
        <Paper withBorder p="xl">
          <Stack>
            <div>
              <Group justify="space-between" align="start">
                <Group>
                  <Avatar src={user.imageUrl} alt={user.imageUrl} size="xl" />
                  <div>
                    <Title order={2}>
                      {`${user.firstName ?? ""} ${user.lastName ?? ""}`}
                    </Title>
                    <Text inline c="dimmed">
                      {user.emailAddresses[0]?.emailAddress}
                    </Text>
                    <Badge variant="light" mt="xs" radius="xs">
                      {role ?? "STUDENT"}
                    </Badge>
                  </div>
                </Group>
                <LazyProfileButton profileId={user.id} profileRole={role} />
              </Group>
              <Text mt="xs">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam sed
                delectus reiciendis quisquam deleniti modi aut quam provident
                odio, tempora placeat doloremque vel quidem impedit, beatae
                natus repudiandae, ut voluptatem!
              </Text>
            </div>
          </Stack>
        </Paper>
        <Paper withBorder p="xl">
          <Accordion>
            <Accordion.Item value="applications">
              <Accordion.Control>
                <Text fw="700">Availability</Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Stack>
                  <Group justify="space-between">
                    <Text>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </Text>
                    <Badge>Time</Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </Text>
                    <Badge>Time</Badge>
                  </Group>
                  <Group justify="space-between">
                    <Text>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </Text>
                    <Badge>Time</Badge>
                  </Group>
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Paper>
      </Stack>
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
