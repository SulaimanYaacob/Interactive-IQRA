import {
  Accordion,
  Anchor,
  Avatar,
  Box,
  Center,
  Container,
  Group,
  Select,
  Stack,
  Tabs,
  Text,
} from "@mantine/core";
import Link from "next/link";
import { BsFileEarmark } from "react-icons/bs";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";
import { TUTOR_APPLICATION_STATUS } from "~/utils/constants";

function Applications() {
  const { data: applications, isLoading } = api.tutor.getApplications.useQuery(
    undefined,
    { refetchOnWindowFocus: false }
  );

  const utils = api.useUtils().tutor.getApplications;
  const { mutate } = api.tutor.updateApplicationStatus.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
  });

  if (isLoading) return <Loading />;

  if (!applications?.length) return null;

  return (
    <Container size="sm" my="xl">
      <Tabs>
        <Tabs.List>
          <Tabs.Tab value="123"> 123</Tabs.Tab>
        </Tabs.List>
        <Stack>
          <Stack>
            <Accordion chevronPosition="left">
              {applications.map(
                ({
                  applicationId,
                  files,
                  status,
                  user,
                  createdAt,
                  createdByClerkId,
                }) => {
                  return (
                    <Accordion.Item key={user?.id} value={applicationId}>
                      <Center pos="relative">
                        <Accordion.Control>
                          <Group gap="xs">
                            <Avatar visibleFrom="xs" src={user?.imageUrl} />
                            <Box w={{ base: "125px", xs: "auto" }}>
                              <Group gap="xs">
                                <Text fz={{ base: "xs", xs: "md" }} fw="500">
                                  {(user?.firstName ?? "") +
                                    (user?.lastName ?? "")}
                                </Text>
                                <Text size="xs" c="dimmed" visibleFrom="xs">
                                  {new Date(createdAt).toLocaleDateString()}
                                </Text>
                              </Group>
                              <Text
                                visibleFrom="xs"
                                fz={{ base: "xs", xs: "sm" }}
                                c="dimmed"
                              >
                                {user?.emailAddresses[0]?.emailAddress}
                              </Text>
                            </Box>
                          </Group>
                        </Accordion.Control>
                        <Select
                          mx="md"
                          fw="500"
                          w="200px"
                          right={0}
                          pos="absolute"
                          value={status}
                          visibleFrom="xs"
                          withCheckIcon={false}
                          allowDeselect={false}
                          data={Object.values(TUTOR_APPLICATION_STATUS)}
                          onChange={(status) =>
                            mutate({
                              applicationId,
                              status: status as TUTOR_APPLICATION_STATUS,
                              userId: createdByClerkId,
                            })
                          }
                        />
                        <Select
                          mx="md"
                          fw="500"
                          w="100px"
                          size="xs"
                          right={0}
                          value={status}
                          pos="absolute"
                          hiddenFrom="xs"
                          withCheckIcon={false}
                          allowDeselect={false}
                          data={Object.values(TUTOR_APPLICATION_STATUS)}
                          onChange={(status) =>
                            mutate({
                              applicationId,
                              status: status as TUTOR_APPLICATION_STATUS,
                              userId: createdByClerkId,
                            })
                          }
                        />
                      </Center>
                      <Accordion.Panel>
                        <Stack gap="xs">
                          {files?.map((file) => (
                            <Group key={file.key}>
                              <Box visibleFrom="xs">
                                <BsFileEarmark
                                  size="32"
                                  color="var(--mantine-color-dimmed)"
                                />
                              </Box>
                              <div>
                                <Anchor
                                  truncate="end"
                                  fw="500"
                                  fz={{ base: "xs", xs: "md" }}
                                  component={Link}
                                  href={file.url}
                                  target="_blank"
                                >
                                  {file.name}
                                </Anchor>
                                <Group gap="5px">
                                  <Text
                                    lineClamp={1}
                                    fz={{ base: "xs", xs: "sm" }}
                                    c="dimmed"
                                  >
                                    {`${file.size / 1000} KB`}
                                  </Text>
                                  <Text
                                    fz={{ base: "xs", xs: "sm" }}
                                    c="dimmed"
                                  >
                                    -
                                  </Text>
                                  <Text
                                    fz={{ base: "xs", xs: "sm" }}
                                    c="dimmed"
                                  >
                                    {file.type}
                                  </Text>
                                </Group>
                              </div>
                            </Group>
                          ))}
                        </Stack>
                      </Accordion.Panel>
                    </Accordion.Item>
                  );
                }
              )}
            </Accordion>
          </Stack>
        </Stack>
      </Tabs>
    </Container>
  );
}

export default Applications;
