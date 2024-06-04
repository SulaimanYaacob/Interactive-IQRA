import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import EditAvailabilityModalContent from "~/components/dynamic/modals/EditAvailabilityModalContent";
import { api } from "~/utils/api";
import {
  errorProps,
  mutateProps,
  successProps,
} from "~/utils/notificationProps";

const useEditProfileAvailability = () => {
  const { reload } = useRouter();
  const { mutate } = api.user.editProfileAvailability.useMutation({
    onMutate: () => {
      notifications.show({
        id: "update-profile-availability",
        title: "Updating Profile Availability",
        message: "Please wait while we update your info",
        ...mutateProps,
      });
    },
    onSuccess: () => {
      notifications.update({
        id: "update-profile-availability",
        title: "Profile Updated!",
        message: "Your availability has been updated",
        ...successProps,
      });
      reload();
    },
    onError: (error) => {
      notifications.update({
        id: "update-profile-availability",
        title: "Unable to update availability",
        message: error.message,
        ...errorProps,
      });
    },
  });

  const openEditAvailabilityModal = () => {
    modals.open({
      title: "Update Availability",
      children: <EditAvailabilityModalContent mutate={mutate} />,
      centered: true,
      size: "lg",
    });
  };

  return { openEditAvailabilityModal };
};

export default useEditProfileAvailability;
