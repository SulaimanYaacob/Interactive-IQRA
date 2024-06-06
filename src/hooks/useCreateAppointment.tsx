import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import CreateAppointmentModalContent from "~/components/dynamic/modals/CreateAppointmentModalContent";
import type { ClerkPublicMetadata } from "~/types/publicMetadata";
import { api } from "~/utils/api";
import {
  errorProps,
  mutateProps,
  successProps,
} from "~/utils/notificationProps";

const useCreateAppointment = () => {
  const { mutate, isLoading } = api.appointment.createAppointment.useMutation({
    onMutate: () => {
      notifications.show({
        id: "send-appointment",
        title: "Sending an Appointment",
        message: "Please wait while send your appointment",
        ...mutateProps,
      });
    },
    onSuccess: () => {
      notifications.update({
        id: "send-appointment",
        title: "Appointment Sent!",
        message: "Your appointment has been sent to the tutor",
        ...successProps,
      });
    },
    onError: (error) => {
      notifications.update({
        id: "send-appointment",
        title: "Unable to send an appointment",
        message: error.message,
        ...errorProps,
      });
    },
  });

  const openCreateAppointmentModal = ({
    availability,
  }: {
    availability: ClerkPublicMetadata["availability"];
  }) => {
    modals.open({
      title: "Request Appointment",
      children: (
        <CreateAppointmentModalContent
          mutate={mutate}
          availability={availability}
        />
      ),
      centered: true,
      size: "md",
    });
  };

  return { openCreateAppointmentModal, isLoading };
};

export default useCreateAppointment;
