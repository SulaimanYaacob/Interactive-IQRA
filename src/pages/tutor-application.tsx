import { Container, Stack, Text, Title } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { FaRegFile, FaUpload, FaXmark } from "react-icons/fa6";
import useUploadApplication from "~/hooks/useUploadApplication";

function TutorApplication() {
  const { openUploadApplicationModal } = useUploadApplication();
  return (
    <Container my="xl">
      <Stack gap="xl">
        <Stack gap="0">
          <Title fz={{ base: 18, xs: 24, sm: 36 }} ta="center">
            Upload your qualifications
          </Title>
        </Stack>

        <Dropzone
          mx="xl"
          multiple={false}
          onDrop={(e) => openUploadApplicationModal(e[0]!)}
          maxSize={5242880}
          accept={["application/pdf", "image/*", "application/zip"]}
        >
          <Stack h="70vh" align="center" justify="center">
            <Dropzone.Accept>
              <FaUpload size="64" />
            </Dropzone.Accept>
            <Dropzone.Idle>
              <FaRegFile color="var(--mantine-color-dimmed)" size="64" />
            </Dropzone.Idle>
            <Dropzone.Reject>
              <FaXmark size="64" />
            </Dropzone.Reject>
            <Stack gap="xs">
              <Text inline ta="center" fz={{ base: 18, xs: 24 }}>
                Drop your files here
              </Text>
              <Text
                fz={{ base: 12, xs: 14, sm: 16 }}
                c="dimmed"
                ta="center"
                inline
                size="sm"
              >
                Max file size: 5MB
              </Text>
            </Stack>
          </Stack>
        </Dropzone>
      </Stack>
    </Container>
  );
}

export default TutorApplication;
