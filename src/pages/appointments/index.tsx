import { useSession } from "@clerk/nextjs";
import {
  Accordion,
  Avatar,
  Center,
  Container,
  Group,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";
import { STATUS } from "~/utils/constants";

function Appointment() {
  const { session } = useSession();
  const { data: appointments } = api.appointment.getUserAppointments.useQuery();

  const tutorStatus = Object.values(STATUS).filter((status) => {
    return status !== STATUS.CANCELLED;
  });

  if (!session || !appointments) return <Loading />;
  const { user } = session;

  if (!appointments)
    return (
      <Container my="xl">
        <Title ta="center">You have no appointments</Title>
      </Container>
    );

  return (
    <Container my="xl">
      <Stack>
        <Title>Appointments</Title>
        <Stack>
          <Accordion>
            {appointments.map(
              ({
                appointmentId,
                studentInfo,
                createdAt,
                startTime,
                endTime,
                comments,
              }) => {
                return (
                  <Accordion.Item value={appointmentId} key={appointmentId}>
                    <Center pos="relative">
                      <Accordion.Control>
                        <Group>
                          <Avatar
                            src={studentInfo.imageUrl}
                            alt={studentInfo.imageUrl}
                          />
                          <Stack gap="0">
                            <Group gap="xs">
                              <Text fz={{ base: "xs", xs: "md" }} fw="500">
                                {(user?.firstName ?? "") +
                                  (user?.lastName ?? "")}
                              </Text>
                              <Text size="xs" c="dimmed" visibleFrom="xs">
                                {new Date(createdAt).toLocaleDateString()}
                              </Text>
                            </Group>

                            <Text c="dimmed" fz={{ base: "xs", xs: "md" }}>
                              {user.emailAddresses[0]?.emailAddress}
                            </Text>
                          </Stack>
                        </Group>
                      </Accordion.Control>
                      <Select
                        mx="md"
                        fw="500"
                        w="200px"
                        right={0}
                        pos="absolute"
                        visibleFrom="xs"
                        withCheckIcon={false}
                        allowDeselect={false}
                        defaultValue={status}
                        data={Object.values(STATUS).filter(
                          (status) => status !== STATUS.CANCELLED
                        )}
                      />
                      <Select
                        mx="md"
                        fw="500"
                        w="100px"
                        size="xs"
                        right={0}
                        hiddenFrom="xs"
                        pos="absolute"
                        withCheckIcon={false}
                        allowDeselect={false}
                        defaultValue={status}
                        data={Object.values(STATUS).filter(
                          (status) => status !== STATUS.CANCELLED
                        )}
                      />
                    </Center>

                    <Accordion.Panel>
                      <Text>{comments}</Text>
                    </Accordion.Panel>
                  </Accordion.Item>
                );
              }
            )}
          </Accordion>
        </Stack>
      </Stack>
    </Container>
  );
}

export default Appointment;
