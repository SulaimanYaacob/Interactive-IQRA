import { Button, Container, Stack, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { UploadDropzone } from "~/utils/uploadthing";
import { errorProps, mutateProps } from "~/utils/notificationProps";
import Loading from "~/components/Loading";
import useHandleApplication from "~/hooks/useHandleApplication";
import { api } from "~/utils/api";

function TutorApplication() {
  const { uploadApplication, cancelApplication } = useHandleApplication();

  const { data: applicationStatus, isLoading } =
    api.tutor.getUserApplicationStatus.useQuery(undefined, {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });

  const CheckApplicationStatus = () => {
    if (!applicationStatus && isLoading) return <Loading />;

    if (!applicationStatus)
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

    if (applicationStatus) {
      return (
        <Title ta="center">
          Your application status is {applicationStatus.status}
          <Button
            onClick={() => cancelApplication()}
            color="red"
            variant="outline"
            size="xs"
          >
            Cancel
          </Button>
        </Title>
      );
    }
  };

  return (
    <Container size="xs">
      <Stack justify="center" mih="75vh">
        <CheckApplicationStatus />
      </Stack>
    </Container>
  );
}

export default TutorApplication;
