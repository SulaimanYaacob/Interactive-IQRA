import {
  Avatar,
  Badge,
  Breadcrumbs,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import dynamic from "next/dynamic";
import { daysObject } from "~/utils/constants";
import type { GetStaticPropsContext } from "next";
import { clerkClient } from "@clerk/nextjs/server";
import { type User } from "@clerk/nextjs/dist/types/server";
import type { ClerkPublicMetadata } from "~/types/publicMetadata";
const LazyProfileButton = dynamic(
  () => import("~/components/dynamic/ProfileButton"),
  { ssr: false }
);
const Profile = ({ user }: { user: User }) => {
  const { bio, role, availability } =
    user.publicMetadata as unknown as ClerkPublicMetadata;

  //TODO Change the nameeee it editProfile button
  return (
    <Container my="xl">
      <Stack>
        <Paper withBorder p="xl">
          <Stack>
            <div>
              <Group justify="space-between" align="start" pos="relative">
                <Group mr="46px">
                  <Avatar src={user.imageUrl} alt={user.imageUrl} size="xl" />
                  <div>
                    <Title fz="xl">
                      {`${user.firstName ?? ""} ${user.lastName ?? ""}`}
                    </Title>

                    <Text inline c="dimmed">
                      {user.emailAddresses[0]?.emailAddress}
                    </Text>
                    <Group mt="xs">
                      <Badge variant="default" radius="xs" tt="lowercase">
                        {user.username ?? ""}
                      </Badge>
                      <Badge variant="gradient" radius="xs">
                        {role ?? "STUDENT"}
                      </Badge>
                    </Group>
                  </div>
                </Group>
                <LazyProfileButton
                  type="detail"
                  profileId={user.id}
                  profileRole={role}
                />
              </Group>
              <Text mt="xs">{bio}</Text>
            </div>
          </Stack>
        </Paper>
        <Paper withBorder p="xl">
          <Stack gap="xl">
            <Group justify="space-between" pos="relative">
              <Text fw="700" size="xl">
                Availability
              </Text>
              <LazyProfileButton
                type="availability"
                profileId={user.id}
                profileRole={role}
              />
            </Group>

            <Stack>
              {Object.values(daysObject).map(({ index, name }) => (
                <Group justify="space-between" key={index}>
                  <Text w="100px" tt="capitalize">
                    {name}
                  </Text>
                  <Breadcrumbs separator="-">
                    <Badge>{availability?.sundayStart}</Badge>
                    <Badge>{availability?.sundayEnd}</Badge>
                  </Breadcrumbs>
                </Group>
              ))}
            </Stack>
          </Stack>
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
