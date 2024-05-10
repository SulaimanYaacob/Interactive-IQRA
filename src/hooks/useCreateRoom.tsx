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
import {
  errorProps,
  mutateProps,
  successProps,
} from "~/utils/notificationProps";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { FaCircleInfo } from "react-icons/fa6";
import { notifications } from "@mantine/notifications";
import type { CreateRoomInput } from "~/server/api/routers/liveblocksRouter";

const useCreateRoom = () => {
  const { push } = useRouter();

  const { mutate } = api.liveblocks.createRoom.useMutation({
    onMutate: () => {
      notifications.show({
        id: "create-room",
        title: "Creating for Room",
        message: "Please wait while we create the room",
        ...mutateProps,
      });
    },
    onSuccess: async (room) => {
      notifications.update({
        id: "create-room",
        title: "Room Successfully Created!",
        message: "Redirecting you to the room",
        ...successProps,
      });
      await push(`/room/${room?.liveblocksRoom.id}`);
    },
    onError: (error) => {
      notifications.update({
        id: "create-room",
        title: "Unable to create room",
        message: error.message,
        ...errorProps,
      });
    },
  });
  const openSelfTaughtModal = () => {
    modals.open({
      size: "md",
      withCloseButton: false,
      centered: true,
      children: <CreateRoomModalContent mutate={mutate} />,
    });
  };

  return { openSelfTaughtModal };
};

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

export default useCreateRoom;
