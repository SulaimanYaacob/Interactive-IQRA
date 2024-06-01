import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import BookAppointmentModalContent from "~/components/dynamic/modals/BookAppointmentModalContent";
import { api } from "~/utils/api";
import {
  errorProps,
  mutateProps,
  successProps,
} from "~/utils/notificationProps";

const useBookAppointment = () => {
  const { reload } = useRouter();
  const { mutate } = api.user.editProfileAvailability.useMutation({
    onMutate: () => {
      notifications.show({
        id: "book-appointment",
        title: "Booking an Appointment",
        message: "Please wait while we book your appointment",
        ...mutateProps,
      });
    },
    onSuccess: () => {
      notifications.update({
        id: "book-appointment",
        title: "Appointment Booked!",
        message: "Your appointment has been booked",
        ...successProps,
      });
      reload();
    },
    onError: (error) => {
      notifications.update({
        id: "book-appointment",
        title: "Unable to book an appointment",
        message: error.message,
        ...errorProps,
      });
    },
  });

  const openBookAppointmentModal = () => {
    modals.open({
      title: "",
      children: <BookAppointmentModalContent />,
      centered: true,
      size: "xl",
    });
  };

  return { openBookAppointmentModal };
};

export default useBookAppointment;
