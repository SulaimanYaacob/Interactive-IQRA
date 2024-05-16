import { Button, Container, Paper, Stack, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { UploadDropzone } from "~/utils/uploadthing";
import { errorProps, mutateProps } from "~/utils/notificationProps";
import Loading from "~/components/Loading";
import useHandleApplication from "~/hooks/useHandleApplication";
import { api } from "~/utils/api";
import { STATUS } from "@prisma/client";
import {
  PiCheckCircleDuotone,
  PiFileMagnifyingGlassDuotone,
} from "react-icons/pi";

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

    if (applicationStatus === STATUS.PENDING) {
      return (
        <Paper withBorder p="md">
          <Stack align="center">
            <PiFileMagnifyingGlassDuotone
              color="var(--mantine-color-orange-4)"
              size="128"
            />
            <Stack align="center" gap="0">
              <Title order={2} ta="center">
                Your application is sent
              </Title>
              <Text c="dimmed" ta="center">
                Please wait while we review your application
              </Text>
            </Stack>
            <Button onClick={() => cancelApplication()} color="red">
              Cancel Application
            </Button>
          </Stack>
        </Paper>
      );
    } else if (applicationStatus === STATUS.ACCEPTED) {
      return (
        <Paper withBorder p="md">
          <Stack align="center">
            <PiCheckCircleDuotone
              color="var(--mantine-color-green-4)"
              size="128"
            />
            <Stack align="center" gap="0">
              <Title order={2} ta="center">
                Your application has been accepted!
              </Title>
              <Text c="dimmed" ta="center">
                You are qualified to be a tutor
              </Text>
            </Stack>
          </Stack>
        </Paper>
      );
    } else if (applicationStatus === STATUS.REJECTED) {
      return (
        <Paper withBorder p="md">
          <Stack align="center">
            <PiCheckCircleDuotone
              color="var(--mantine-color-red-4)"
              size="128"
            />
            <Stack align="center" gap="0">
              <Title order={2} ta="center">
                Your application has been rejected
              </Title>
              <Text c="dimmed" ta="center">
                We are sorry, you are not qualified to be a tutor
              </Text>
            </Stack>
            <Button onClick={() => cancelApplication()}>
              Submit a new application
            </Button>
          </Stack>
        </Paper>
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
