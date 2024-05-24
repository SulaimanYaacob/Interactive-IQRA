import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import EditProfileModalContent from "~/components/dynamic/modals/EditProfileModalContent";
import { api } from "~/utils/api";
import {
  errorProps,
  mutateProps,
  successProps,
} from "~/utils/notificationProps";

const useEditProfile = () => {
  const { reload } = useRouter();
  const { mutate } = api.user.editUserProfile.useMutation({
    onMutate: () => {
      notifications.show({
        id: "update-profile-info",
        title: "Updating Profile",
        message: "Please wait while we update your profile",
        ...mutateProps,
      });
    },
    onSuccess: () => {
      notifications.update({
        id: "update-profile-info",
        title: "Profile Updated!",
        message: "Your profile has been updated",
        ...successProps,
      });
      reload();
    },
    onError: (error) => {
      notifications.update({
        id: "update-profile-info",
        title: "Unable to update profile",
        message: error.message,
        ...errorProps,
      });
    },
  });

  const openEditProfileModal = () => {
    modals.open({
      children: <EditProfileModalContent mutate={mutate} />,
      centered: true,
      size: "md",
    });
  };

  return { openEditProfileModal };
};

export default useEditProfile;
