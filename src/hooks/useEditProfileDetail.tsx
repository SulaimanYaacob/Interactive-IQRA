import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import EditDetailModalContent from "~/components/dynamic/modals/EditDetailModalContent";
import { api } from "~/utils/api";
import {
  errorProps,
  mutateProps,
  successProps,
} from "~/utils/notificationProps";

const useEditProfileDetail = () => {
  const { reload } = useRouter();
  const { mutate } = api.user.editProfileDetail.useMutation({
    onMutate: () => {
      notifications.show({
        id: "update-detail-info",
        title: "Updating Profile Detail",
        message: "Please wait while we update your info",
        ...mutateProps,
      });
    },
    onSuccess: () => {
      notifications.update({
        id: "update-detail-info",
        title: "Detail Updated!",
        message: "Your detail has been updated",
        ...successProps,
      });
      reload();
    },
    onError: (error) => {
      notifications.update({
        id: "update-detail-info",
        title: "Unable to update detail",
        message: error.message,
        ...errorProps,
      });
    },
  });

  const openEditDetailModal = () => {
    modals.open({
      children: <EditDetailModalContent mutate={mutate} />,
      centered: true,
      size: "md",
    });
  };

  return { openEditDetailModal };
};

export default useEditProfileDetail;
