import { useSession } from "@clerk/nextjs";

import { Button, SimpleGrid, Stack, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import type { EditProfileInput } from "~/server/api/routers/userRouter";

//TODO Add Validations
const EditProfileModalContent = ({
  mutate,
}: {
  mutate: (profileInput: EditProfileInput) => void;
}) => {
  const { session } = useSession();
  const { getInputProps, onSubmit } = useForm<EditProfileInput>({
    initialValues: {
      firstName: session?.user.firstName ?? "",
      lastName: session?.user.lastName ?? "",
      username: session?.user.username ?? "",
      bio: String(session?.user.publicMetadata.bio ?? ""),
    },
    validate: {},
  });

  if (!session) return null;

  //   const imageURL =
  //     typeof values.profileImage === "object"
  //       ? URL.createObjectURL(values.profileImage as Blob)
  //       : null;

  return (
    <form
      onSubmit={onSubmit((val) => {
        mutate(val);
        modals.closeAll();
      })}
    >
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
        <Textarea label="Bio (Optional)" {...getInputProps("bio")} />
        <Button type="submit">Update</Button>
      </Stack>
    </form>
  );
};

export default EditProfileModalContent;
