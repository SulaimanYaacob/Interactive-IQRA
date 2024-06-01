import {
  Avatar,
  Badge,
  Breadcrumbs,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import dynamic from "next/dynamic";
import type { GetStaticPropsContext } from "next";
import { clerkClient } from "@clerk/nextjs/server";
import { type User } from "@clerk/nextjs/dist/types/server";
import type { ClerkPublicMetadata } from "~/types/publicMetadata";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { daysObject } from "~/utils/constants";
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
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Paper withBorder p="xl">
            <Stack gap="xs">
              <Group mb="md" justify="space-between" pos="relative">
                <Text fw="700" size="xl">
                  Availability
                </Text>
                <LazyProfileButton
                  type="availability"
                  profileId={user.id}
                  profileRole={role}
                />
              </Group>

              {
                //TODO Fix this shit
                availability ? (
                  Object.keys(daysObject).map((day) => {
                    //* Pretty f**ked up code here but it works for now :shrug:
                    dayjs.extend(customParseFormat);
                    const availabilityKey =
                      `${day}Availability` as keyof typeof availability;
                    const startKey = `${day}Start` as keyof typeof availability;
                    const endKey = `${day}End` as keyof typeof availability;

                    const startTime = dayjs(
                      String(availability?.[startKey]),
                      "HH:mm"
                    ).format("hh:mm A");

                    const endTime = dayjs(
                      String(availability?.[endKey]),
                      "HH:mm"
                    ).format("hh:mm A");

                    const isAvailable = Boolean(
                      availability?.[availabilityKey]
                    );

                    if (!isAvailable) return null;

                    return (
                      <Paper key={day} withBorder p="md">
                        <Group justify="space-between">
                          <Text fw="500" w="100px" tt="capitalize">
                            {day}
                          </Text>
                          <Breadcrumbs separator="-">
                            <Badge size="lg" radius="xs">
                              {startTime}
                            </Badge>
                            <Badge size="lg" radius="xs">
                              {endTime}
                            </Badge>
                          </Breadcrumbs>
                        </Group>
                      </Paper>
                    );
                  })
                ) : (
                  <Text>No availability set</Text>
                )
              }
            </Stack>
          </Paper>
          <Paper withBorder p="xl">
            <Stack gap="xs">
              <Group mb="md" justify="space-between" pos="relative">
                <Text fw="700" size="xl">
                  Testimonials
                </Text>
              </Group>
              <Text></Text>
            </Stack>
          </Paper>
        </SimpleGrid>
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
