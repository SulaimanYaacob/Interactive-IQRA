import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import CreateAppointmentModalContent from "~/components/dynamic/modals/CreateAppointmentModalContent";
import type { BookedAppointments } from "~/pages/profile/[userId]";
import type { ClerkPublicMetadata } from "~/types/publicMetadata";
import { api } from "~/utils/api";
import {
  errorProps,
  mutateProps,
  successProps,
} from "~/utils/notificationProps";

const useCreateAppointment = () => {
  const { push } = useRouter();
  const { mutate, isLoading } =
    api.appointment.createAppointmentCheckoutSession.useMutation({
      onMutate: () => {
        notifications.show({
          id: "send-appointment",
          title: "Creating Checkout Session",
          message: "Please wait while we create the checkout session",
          ...mutateProps,
        });
      },
      onSuccess: async (url) => {
        notifications.update({
          id: "send-appointment",
          title: "Checkout Session Created",
          message: "Redirecting you to the checkout session",
          ...successProps,
        });
        await push(url!);
      },
      onError: (error) => {
        notifications.update({
          id: "send-appointment",
          title: "Unable to create a checkout session",
          message: error.message,
          ...errorProps,
        });
      },
    });

  const openCreateAppointmentModal = ({
    availability,
    bookedAppointments,
  }: {
    availability: ClerkPublicMetadata["availability"];
    bookedAppointments?: BookedAppointments[];
  }) => {
    modals.open({
      title: "Request Appointment",
      children: (
        <CreateAppointmentModalContent
          mutate={mutate}
          availability={availability}
          bookedAppointments={bookedAppointments}
        />
      ),
      centered: true,
      size: "md",
    });
  };

  return { openCreateAppointmentModal, isLoading };
};

export default useCreateAppointment;
