import { notifications } from "@mantine/notifications";
import { api } from "~/utils/api";
import {
  successProps,
  errorProps,
  mutateProps,
} from "~/utils/notificationProps";

const useCancelApplication = () => {
  const utils = api.useUtils();
  const { mutate: cancelApplication } = api.tutor.cancelApplication.useMutation(
    {
      onMutate: () => {
        notifications.show({
          id: "cancel-application",
          title: "Cancelling Application",
          message: "Please wait while we cancel your application",
          ...mutateProps,
        });
      },
      onSuccess: async () => {
        notifications.update({
          id: "cancel-application",
          title: "Application Cancelled",
          message: "Your application has been cancelled",
          ...successProps,
        }),
          await utils.tutor.getUserApplicationStatus.invalidate();
        // reload();
      },
      onError: (error) => {
        notifications.update({
          id: "cancel-application",
          title: "Unable to Cancel Application",
          message: error.message,
          ...errorProps,
        });
      },
    }
  );

  return { cancelApplication };
};

export default useCancelApplication;
