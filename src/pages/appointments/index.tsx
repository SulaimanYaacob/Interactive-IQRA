import { useSession } from "@clerk/nextjs";
import { Container, Tabs, Title } from "@mantine/core";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";

function Appointment() {
  const { session } = useSession();
  const { data: appointments } = api.appointment.getUserAppointments.useQuery();

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
      <Title>Appointments</Title>
      <Tabs></Tabs>
    </Container>
  );
}

export default Appointment;
