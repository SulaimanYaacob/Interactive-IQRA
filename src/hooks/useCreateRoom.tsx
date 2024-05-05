import {
  Alert,
  Button,
  Divider,
  Paper,
  SegmentedControl,
  Slider,
  Stack,
  Text,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { useState } from "react";
import { FaCircleInfo } from "react-icons/fa6";

const useCreateRoom = () => {
  const openSelfTaughtModal = () => {
    modals.open({
      size: "md",
      withCloseButton: false,
      centered: true,
      children: <CreateRoomModalContent />,
    });
  };

  return { openSelfTaughtModal };
};

const CreateRoomModalContent = () => {
  const [slideValue, setSlideValue] = useState<number>(6);

  return (
    <form>
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
                defaultValue="1"
                disabled
                data={["1", "2", "3", "4", "5", "6"]} // Must be link with the purchased books
              />
            </Stack>
            <Stack>
              <Divider
                label={
                  <Text c="gray" fw={500}>{`Max User: ${slideValue}`}</Text>
                }
              />
              <Slider
                defaultValue={slideValue}
                onChange={setSlideValue}
                min={2}
                max={10}
                label={null}
                styles={{ markLabel: { display: "none" } }}
              />
            </Stack>
          </Stack>
        </Paper>
        <Button type="submit">Create Room</Button>
      </Stack>
    </form>
  );
};

export default useCreateRoom;
