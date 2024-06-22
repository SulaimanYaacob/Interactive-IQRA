import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { api } from "~/utils/api";
import {
  successProps,
  errorProps,
  mutateProps,
} from "~/utils/notificationProps";
import dynamic from "next/dynamic";
const LazyCancelAppointmentModalContent = dynamic(
  import("~/components/dynamic/modals/CancelAppointmentModalContent"),
  { ssr: false }
);

const useCancelAppointment = () => {
  const utils = api.useUtils();
  const { mutate } = api.appointment.cancelAppointment.useMutation({
    onMutate: () => {
      notifications.show({
        id: "cancel-appointment",
        title: "Cancelling appointment",
        message: "Please wait while we cancel your appointment",
        ...mutateProps,
      });
    },
    onSuccess: async () => {
      notifications.update({
        id: "cancel-appointment",
        title: "Appointment Cancelled",
        message: "Your appointment has been cancelled",
        ...successProps,
      }),
        await utils.appointment.getUserAppointments.invalidate();
    },
    onError: (error) => {
      notifications.update({
        id: "cancel-appointment",
        title: "Unable to Cancel appointment",
        message: error.message,
        ...errorProps,
      });
    },
  });

  const openCancelAppointmentModal = ({
    appointmentId,
  }: {
    appointmentId: string;
  }) => {
    modals.open({
      size: "md",
      centered: true,
      children: (
        <LazyCancelAppointmentModalContent
          mutate={mutate}
          appointmentId={appointmentId}
        />
      ),
    });
  };

  return { openCancelAppointmentModal };
};

export default useCancelAppointment;
