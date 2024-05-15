import {
  Button,
  Center,
  Divider,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { type FileWithPath } from "@mantine/dropzone";
import { modals } from "@mantine/modals";

const useUploadApplication = () => {
  const openUploadApplicationModal = (file: FileWithPath) => {
    modals.open({
      size: "md",
      centered: true,
      withCloseButton: false,
      closeOnClickOutside: false,
      children: <UploadApplicationModalContent file={file} />,
    });
  };

  return { openUploadApplicationModal };
};

const UploadApplicationModalContent = ({ file }: { file: FileWithPath }) => {
  return (
    file && (
      <Center m="xs">
        <Stack>
          <Text fw="500" ta="center" fz={{ base: 18, xs: 24 }}>
            Are you sure this is the correct file?
          </Text>
          <Divider />
          <Stack align="center" gap="xs" justify="center">
            {/* <FaRegFile color="var(--mantine-color-dimmed)" size="64" /> */}
            <Text fw="500" variant="dot" ta="center">
              {file.name}
            </Text>
          </Stack>
          {/* <iframe
          style={{
              border: "none",
              width: "100%",
              height: "95vh",
              overflow: "auto",
            }}
            src={URL.createObjectURL(file)}
        /> */}
          <Divider />
          <SimpleGrid cols={2}>
            <Button onClick={() => modals.closeAll()} color="red">
              Cancel
            </Button>
            <Button>Upload</Button>
          </SimpleGrid>
        </Stack>
      </Center>
    )
  );
};

export default useUploadApplication;
