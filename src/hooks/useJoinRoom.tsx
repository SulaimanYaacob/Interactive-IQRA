import { Button, PinInput, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { hasLength, useForm } from "@mantine/form";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";

const useJoinRoom = () => {
  const { push } = useRouter();
  const { getInputProps, onSubmit, errors, reset } = useForm({
    mode: "uncontrolled",
    initialValues: {
      roomId: "",
    },
    validate: {
      roomId: hasLength({ min: 3, max: 6 }, "Invalid Room PIN"),
    },
  });

  const { mutate, isLoading } = api.liveblocks.searchingRoom.useMutation({
    onSuccess: async (room) => {
      notifications.update({
        id: "searching-room",
        title: "Room Found",
        message: "Redirecting you to the room",
        autoClose: 3000,
        color: "cyan",
      });
      await push(`/room/${room?.id}`);
    },
    onError: (error) => {
      notifications.update({
        id: "searching-room",
        title: "Room Not Available",
        message: error.message,
        autoClose: 3000,
        color: "red",
      });
    },
    onMutate: () => {
      notifications.show({
        id: "searching-room",
        title: "Searching for Room",
        message: "Please wait while we search for the room",
        autoClose: false,
        color: "cyan",
      });
    },
  });

  useEffect(() => {
    if (errors.roomId) {
      notifications.show({
        title: "Invalid Room PIN",
        message: "Please enter a valid Room PIN",
        color: "red",
      });

      reset();
    }
  }, [errors.roomId, reset]);

  const openJoinRoomModal = () => {
    modals.open({
      size: "sm",
      centered: true,
      withCloseButton: false,
      children: (
        <form
          onSubmit={onSubmit(({ roomId }) => {
            mutate({ roomId }), modals.closeAll(), reset();
          })}
        >
          <Stack my="md" align="center">
            <Text fw={500}>{`Enter the room's PIN`}</Text>
            <PinInput
              fw={500}
              length={6}
              data-autofocus
              {...getInputProps("roomId")}
            />
            <Button type="submit">Enter Room</Button>
          </Stack>
        </form>
      ),
    });
  };

  return { openJoinRoomModal, isLoading, errors };
};

export default useJoinRoom;
