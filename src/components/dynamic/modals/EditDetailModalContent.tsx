import { useSession } from "@clerk/nextjs";

import {
  Avatar,
  Button,
  Center,
  Divider,
  FileButton,
  SimpleGrid,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import { hasLength, matches, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import type { EditProfileDetailInput } from "~/server/api/routers/userRouter";

interface EditProfileImage extends EditProfileDetailInput {
  profileImage: Blob | File | string | undefined;
}

const EditDetailModalContent = ({
  mutate,
}: {
  mutate: (detailInput: EditProfileDetailInput) => void;
}) => {
  const { session } = useSession();
  const { getInputProps, onSubmit, values, isValid } =
    useForm<EditProfileImage>({
      initialValues: {
        profileImage: session?.user.imageUrl ?? "",
        firstName: session?.user.firstName ?? "",
        lastName: session?.user.lastName ?? "",
        username: session?.user.username ?? "",
        bio: String(session?.user.publicMetadata.bio ?? ""),
      },
      validate: {
        firstName: hasLength(
          { min: 2, max: 20 },
          "First Name must be 2-20 characters"
        ),
        lastName: hasLength(
          { max: 20 },
          "Last Name must be under 20 characters"
        ),
        username: matches(
          /^[a-zA-Z0-9_-]{5,10}$/,
          "Username must be 5-10 characters and contain only letters, numbers, and dashes"
        ),
        bio: hasLength({ max: 300 }, "Bio must be under 300 characters"),
      },
      validateInputOnChange: true,
    });

  if (!session) return null;

  const imageURL =
    typeof values.profileImage === "object"
      ? URL.createObjectURL(values.profileImage as Blob)
      : null;

  return (
    <form
      onSubmit={onSubmit(({ profileImage, ...rest }) => {
        if (typeof profileImage !== "object") mutate(rest);
        else {
          void Promise.all([
            session?.user.setProfileImage({
              file: (profileImage as File) ?? "",
            }),
            mutate(rest),
          ]);
        }
        modals.closeAll();
      })}
    >
      <Stack>
        <Stack align="center">
          <FileButton {...getInputProps("profileImage")}>
            {(props) => (
              <Center>
                <Avatar
                  {...props}
                  my="xs"
                  size="128"
                  alt="Profile Image"
                  src={imageURL ?? session?.user.imageUrl}
                  style={{ cursor: "pointer" }}
                />
              </Center>
            )}
          </FileButton>
        </Stack>
        <Divider />
        <Stack>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <TextInput label="First Name" {...getInputProps("firstName")} />
            <TextInput
              label="Last Name (Optional)"
              {...getInputProps("lastName")}
            />
          </SimpleGrid>
          <TextInput
            styles={{ input: { textTransform: "lowercase" } }}
            label="Username"
            {...getInputProps("username")}
          />
          <Textarea
            autosize
            maxRows={4}
            minRows={2}
            {...getInputProps("bio")}
            label={`Bio (${300 - Number(values.bio?.length)} Characters Left)`}
          />
          <Button type="submit" disabled={!isValid()}>
            Update
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default EditDetailModalContent;
