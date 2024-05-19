import { Container, Stack } from "@mantine/core";
import Loading from "~/components/Loading";
import {
  PiCheckCircleDuotone,
  PiFileMagnifyingGlassDuotone,
} from "react-icons/pi";
import { api } from "~/utils/api";
import dynamic from "next/dynamic";
const LazyStatusDisplay = dynamic(
  () => import("~/components/dynamic-components/StatusDisplay"),
  { ssr: false }
);
const LazyApplicationDropzone = dynamic(
  () => import("~/components/dynamic-components/ApplicationDropzone"),
  { ssr: false }
);

function TutorApplication() {
  const { data: applicationStatus, isLoading } =
    api.tutor.getUserApplicationStatus.useQuery(undefined, {
      refetchOnWindowFocus: false,
    });

  const CheckApplicationStatus = () => {
    if (!applicationStatus && isLoading) return <Loading />;

    switch (applicationStatus) {
      case "PENDING":
        return (
          <LazyStatusDisplay
            title="Your application is sent"
            color="var(--mantine-color-orange-4)"
            buttonText="Cancel Application"
            description="Please wait while we review your application"
            Icon={PiFileMagnifyingGlassDuotone}
          />
        );
      case "ACCEPTED":
        return (
          <LazyStatusDisplay
            title="Your application has been accepted!"
            color="var(--mantine-color-green-4)"
            description="You are qualified to be a tutor"
            Icon={PiCheckCircleDuotone}
          />
        );
      case "REJECTED":
        return (
          <LazyStatusDisplay
            title="Your application has been rejected"
            color="var(--mantine-color-red-4)"
            description="We are sorry, you are not qualified"
            Icon={PiCheckCircleDuotone}
            buttonText="Submit a new application"
          />
        );
      default:
        return <LazyApplicationDropzone />;
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
