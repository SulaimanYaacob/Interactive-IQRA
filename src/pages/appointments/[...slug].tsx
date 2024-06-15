import {
  Accordion,
  ActionIcon,
  Avatar,
  Badge,
  Container,
  Divider,
  Group,
  Stack,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { createTRPCContext } from "~/server/api/trpc";
import { getTimeFromNow } from "~/utils/dateHandler";
import { PERIOD } from "~/utils/constants";
import { appRouter } from "~/server/api/root";
import Loading from "~/components/Loading";
import { FaXmark } from "react-icons/fa6";
import { api } from "~/utils/api";
import SuperJSON from "superjson";
import { useState } from "react";
import { useRouter } from "next/router";
import useCancelAppointment from "~/hooks/useCancelAppointment";
dayjs.extend(customParseFormat);

function Appointment({ period, page }: { period: PERIOD; page: string }) {
  const [activePage, setPage] = useState(Number(page));
  const [loadTab, setLoadTab] = useState<PERIOD>(period);
  const { openCancelAppointmentModal } = useCancelAppointment();
  const { push } = useRouter();
  //!!!!!!!!!!!!!!!!!! Should put this in middleware !!!!!!!!!!!!!!!!!!
  if (!Object.values(PERIOD).includes(period))
    return (
      <Stack
        align="center"
        justify="center"
        pos="absolute"
        right={0}
        bottom={0}
        h="100vh"
        w="100vw"
      >
        <Title
          style={{ background: "rgba(0,0,0,0.8)" }}
          p="xs"
          pos="absolute"
          top={90}
        >
          Silent Rick Roll
        </Title>
        <iframe
          allow="autoplay"
          style={{ height: "100%", width: "100%", border: "none" }}
          src={`https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1`}
        ></iframe>
      </Stack>
    );
  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  const { data: appointments, isLoading } =
    api.appointment.getUserAppointments.useQuery({
      period,
    });

  // if (!appointments || appointments.length === 0)
  //   return (
  //     <Container my="xl">
  //       <Title ta="center">{`You have no ${
  //         period !== PERIOD.TODAY ? period : "today's"
  //       } appointments`}</Title>
  //     </Container>
  //   );

  return (
    <Container my="xl" size="sm">
      <Tabs
        defaultValue={period}
        onChange={(period) => setLoadTab(period as PERIOD)}
      >
        <Tabs.List grow>
          {Object.values(PERIOD).map((period) => (
            <Tabs.Tab
              fz="md"
              key={period}
              value={period}
              tt="capitalize"
              onClick={() => push(`/appointments/${period}/1`)}
            >
              {period}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        {loadTab !== period || isLoading ? (
          <Loading />
        ) : !appointments || appointments?.length === 0 ? (
          <Container my="xl">
            <Title ta="center">{`You have no ${
              period !== PERIOD.TODAY ? period : "today's"
            } appointments`}</Title>
          </Container>
        ) : (
          <Tabs.Panel my="xl" value={period}>
            <Stack>
              <Accordion variant="contained" chevronPosition="left">
                {/*//* Create a dynamic component for mapping appointments from different dates */}
                {appointments[activePage - 1]?.map(
                  ({
                    appointmentId,
                    userAppointmentsInfo,
                    createdAt,
                    startTime,
                    endTime,
                    comments,
                    status,
                    date,
                  }) => {
                    return (
                      <Accordion.Item value={appointmentId} key={appointmentId}>
                        <Group pos="relative">
                          <Accordion.Control>
                            <Group justify="space-between">
                              <Group>
                                <Avatar
                                  size="lg"
                                  visibleFrom="xs"
                                  src={userAppointmentsInfo.imageUrl}
                                  alt={userAppointmentsInfo.imageUrl}
                                />
                                <Stack gap="0">
                                  <Text fz={{ base: "xs", xs: "md" }} fw="500">
                                    {`${
                                      userAppointmentsInfo?.firstName ?? ""
                                    } ${userAppointmentsInfo?.lastName ?? ""}`}
                                  </Text>

                                  <Text
                                    c="dimmed"
                                    fz={{ base: "xs", xs: "md" }}
                                  >
                                    {
                                      userAppointmentsInfo.emailAddresses[0]
                                        ?.emailAddress
                                    }
                                  </Text>
                                  <Text size="xs" c="dimmed" visibleFrom="xs">
                                    {`booked ${getTimeFromNow(createdAt)}`}
                                  </Text>
                                </Stack>
                              </Group>
                              <Stack
                                visibleFrom="xs"
                                mr="xl"
                                gap="xs"
                                align="end"
                              >
                                {/* {dayjs(date).format("YYYY-MM-DD") ===
                                  dayjs().format("YYYY-MM-DD") && (
                                  <Badge
                                    radius="xs"
                                    variant="outline"
                                    color="teal"
                                  >
                                    Today
                                  </Badge>
                                )} */}
                                <Badge>{status}</Badge>
                                <Badge>{getTimeFromNow(date)}</Badge>
                              </Stack>
                              {/* <Stack
                                visibleFrom="xs"
                                mr="xl"
                                gap="xs"
                                align="end"
                              >
                                <Badge radius="xs">
                                  {dayjs(date).format("dddd MMM D")}
                                </Badge>
                                <Badge variant="dot" radius="xs">
                                  {startTime} - {endTime}
                                </Badge>
                              </Stack> */}
                            </Group>
                          </Accordion.Control>
                          <ActionIcon
                            onClick={openCancelAppointmentModal}
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
                          <Stack>
                            <Divider />
                            <Group gap="xs" justify="center">
                              <Badge>{dayjs(date).format("dddd MMM D")}</Badge>
                              <Badge variant="dot">
                                {startTime} - {endTime}
                              </Badge>
                            </Group>
                            <Divider />
                            {comments ? (
                              <Text>{comments}</Text>
                            ) : (
                              <Text ta="center">No Comment</Text>
                            )}
                          </Stack>
                        </Accordion.Panel>
                      </Accordion.Item>
                    );
                  }
                )}
              </Accordion>
            </Stack>
          </Tabs.Panel>
        )}
      </Tabs>
    </Container>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { query } = ctx;
  const { slug } = query as { slug: string[] };
  const ssh = createServerSideHelpers({
    router: appRouter,
    ctx: createTRPCContext({
      req: ctx.req as NextApiRequest,
      res: ctx.res as NextApiResponse,
    }),
    transformer: SuperJSON,
  });

  await ssh.appointment.getUserAppointments.prefetch({
    period: slug[0]?.toLocaleLowerCase() as PERIOD,
  });

  return {
    props: {
      trpcState: JSON.stringify(ssh.dehydrate()),
      period: slug[0],
      page: slug[1] ?? "",
      // search: slug[2] ?? "",
    },
  };
}

export default Appointment;
