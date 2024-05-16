import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import {
  successProps,
  mutateProps,
  errorProps,
} from "~/utils/notificationProps";

const useHandleApplication = () => {
  const utils = api.useUtils();
  const { reload } = useRouter();
  const { data: applicationStatus } =
    api.tutor.getUserApplicationStatus.useQuery(undefined, {
      refetchOnWindowFocus: false,
    });

  const { mutate: uploadApplication } = api.tutor.uploadApplication.useMutation(
    {
      onSuccess: async () => {
        notifications.update({
          id: "upload-application",
          title: "Upload Complete",
          message: "Your file has been uploaded",
          ...successProps,
        }),
          await utils.tutor.getUserApplicationStatus.invalidate();
      },
    }
  );

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
      onSuccess: () => {
        notifications.update({
          id: "cancel-application",
          title: "Application Cancelled",
          message: "Your application has been cancelled",
          ...successProps,
        }),
          reload();
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

  return { uploadApplication, cancelApplication, applicationStatus };
};

export default useHandleApplication;
