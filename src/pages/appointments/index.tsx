import {
  Accordion,
  ActionIcon,
  Avatar,
  Badge,
  Breadcrumbs,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FaXmark } from "react-icons/fa6";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";
import { getTimeFromNow } from "~/utils/dateHandler";
dayjs.extend(customParseFormat);

function Appointment() {
  const { data: appointments, isLoading } =
    api.appointment.getUserAppointments.useQuery();

  if (!appointments || isLoading) return <Loading />;

  if (!appointments.length)
    return (
      <Container my="xl">
        <Title ta="center">You have no appointments</Title>
      </Container>
    );

  return (
    <Container my="xl" size="sm">
      <Stack>
        <Title>Appointments</Title>
        <Stack>
          <Accordion variant="contained" chevronPosition="left">
            {appointments.map(
              ({
                appointmentId,
                userAppointmentsInfo,
                createdAt,
                startTime,
                endTime,
                comments,
                date,
              }) => {
                return (
                  <Accordion.Item value={appointmentId} key={appointmentId}>
                    <Group pos="relative">
                      <Accordion.Control>
                        <Group justify="space-between">
                          <Group>
                            <Avatar
                              visibleFrom="xs"
                              src={userAppointmentsInfo.imageUrl}
                              alt={userAppointmentsInfo.imageUrl}
                            />
                            <Stack gap="0">
                              <Breadcrumbs separatorMargin="xs" separator="-">
                                <Text fz={{ base: "xs", xs: "md" }} fw="500">
                                  {`${userAppointmentsInfo?.firstName ?? ""} ${
                                    userAppointmentsInfo?.lastName ?? ""
                                  }`}
                                </Text>
                                <Text size="xs" c="dimmed" visibleFrom="xs">
                                  {getTimeFromNow(createdAt)}
                                </Text>
                              </Breadcrumbs>

                              <Text c="dimmed" fz={{ base: "xs", xs: "md" }}>
                                {
                                  userAppointmentsInfo.emailAddresses[0]
                                    ?.emailAddress
                                }
                              </Text>
                            </Stack>
                          </Group>
                          <Stack visibleFrom="xs" mr="xl" gap="xs" align="end">
                            <Badge radius="xs">
                              {dayjs(date).format("dddd MMM D")}
                            </Badge>
                            <Badge variant="dot" radius="xs">
                              {startTime} - {endTime}
                            </Badge>
                          </Stack>
                        </Group>
                      </Accordion.Control>
                      <ActionIcon
                        mr="xs"
                        pos="absolute"
                        right="0"
                        color="red"
                        variant="transparent"
                      >
                        <FaXmark size="24px" />
                      </ActionIcon>
                    </Group>

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
