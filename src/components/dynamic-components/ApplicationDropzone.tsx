import { Stack, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { UploadDropzone } from "~/utils/uploadthing";
import { mutateProps, errorProps } from "~/utils/notificationProps";
import useUploadApplication from "~/hooks/useUploadApplication";

const ApplicationDropzone = () => {
  const { uploadApplication } = useUploadApplication();

  return (
    <>
      <Stack gap="0" ta="center">
        <Title ta="center">Upload Application</Title>
        <Text c="dimmed">Any relevant files e.g CV, Resume</Text>
      </Stack>
      <UploadDropzone
        appearance={{
          container: { borderColor: "var(--mantine-color-dimmed)" },
          label: { color: "var(--mantine-color-blue-7)" },
          button: { background: "var(--mantine-color-blue-7)" },
        }}
        endpoint="imageUploader"
        onUploadBegin={() =>
          notifications.show({
            id: "upload-application",
            title: "Upload in progress",
            message: "Your file is being uploaded",
            ...mutateProps,
          })
        }
        onClientUploadComplete={(files) => uploadApplication({ files })}
        onUploadError={(error: Error) => {
          notifications.show({
            id: "upload-application",
            title: "Upload Failed",
            message: error.message,
            ...errorProps,
          });
        }}
      />
    </>
  );
};

export default ApplicationDropzone;
