import {
  Stack,
  Alert,
  Paper,
  Divider,
  SegmentedControl,
  Slider,
  Button,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { FaCircleInfo } from "react-icons/fa6";
import { type CreateRoomInput } from "~/server/api/routers/liveblocksRouter";

const CreateRoomModalContent = ({
  mutate,
}: {
  mutate: (input: CreateRoomInput) => void;
}) => {
  const { getInputProps, onSubmit, values } = useForm<CreateRoomInput>({
    initialValues: {
      iqraBook: "1",
      maxUsers: 6,
    },
  });

  return (
    <form
      onSubmit={onSubmit((val) => {
        mutate(val), modals.closeAll();
      })}
    >
      <Stack ta="center">
        <Alert
          icon={<FaCircleInfo />}
          title="PIN number is provided once the room is created"
        />
        <Paper p="xl" withBorder>
          <Stack>
            <Stack>
              <Divider
                label={
                  <Text c="gray" fw={500}>
                    Select Iqra Book
                  </Text>
                }
              />
              <SegmentedControl
                disabled
                data={["1", "2", "3", "4", "5", "6"]} // Must be link with the purchased books
                {...getInputProps("iqraBook")}
              />
            </Stack>
            <Stack>
              <Divider
                label={
                  <Text
                    c="gray"
                    fw={500}
                  >{`Max User: ${values.maxUsers}`}</Text>
                }
              />
              <Slider
                min={2}
                max={10}
                label={null}
                value={values.maxUsers}
                styles={{ markLabel: { display: "none" } }}
                {...getInputProps("maxUsers")}
              />
            </Stack>
          </Stack>
        </Paper>
        <Button type="submit">Create Room</Button>
      </Stack>
    </form>
  );
};

export default CreateRoomModalContent;
