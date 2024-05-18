import { notifications } from "@mantine/notifications";
import { api } from "~/utils/api";
import { successProps } from "~/utils/notificationProps";

const useUploadApplication = () => {
  const utils = api.useUtils();

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

  return { uploadApplication };
};

export default useUploadApplication;
