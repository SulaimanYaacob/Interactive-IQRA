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
  const { mutate: cancelAppointment } =
    api.appointment.cancelAppointment.useMutation({
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
          title: "appointment Cancelled",
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

  const openCancelAppointmentModal = () => {
    modals.open({
      size: "md",
      withCloseButton: false,
      centered: true,
      children: <LazyCancelAppointmentModalContent />,
    });
  };

  return { openCancelAppointmentModal };
};

export default useCancelAppointment;
