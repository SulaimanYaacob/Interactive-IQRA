import {
  Stack,
  Divider,
  FocusTrap,
  PinInput,
  Button,
  Text,
} from "@mantine/core";
import { useForm, hasLength } from "@mantine/form";
import { modals } from "@mantine/modals";

const JoinRoomModalContent = ({
  mutate,
}: {
  mutate: ({ roomPIN }: { roomPIN: string }) => void;
}) => {
  const { getInputProps, onSubmit } = useForm({
    mode: "uncontrolled",
    initialValues: { roomPIN: "" },
    validate: { roomPIN: hasLength({ min: 6, max: 6 }) },
  });

  return (
    <form
      onSubmit={onSubmit((val) => {
        mutate(val), modals.closeAll();
      })}
    >
      <Stack>
        <Divider
          label={
            <Text c="gray" fw={500}>
              Enter Valid Room PIN
            </Text>
          }
        />
        <Stack ta="center" align="center">
          <FocusTrap>
            <PinInput
              visibleFrom="sm"
              value=""
              fw={500}
              length={6}
              {...getInputProps("roomPIN")}
            />
          </FocusTrap>
          <FocusTrap>
            <PinInput
              hiddenFrom="sm"
              size="xs"
              value=""
              fw={500}
              length={6}
              {...getInputProps("roomPIN")}
            />
          </FocusTrap>
        </Stack>
        <Divider />
        <Button type="submit">Enter Room</Button>
      </Stack>
    </form>
  );
};

export default JoinRoomModalContent;
