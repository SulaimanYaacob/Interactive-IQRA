import { Button, PinInput, Stack, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { hasLength, useForm } from "@mantine/form";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { FaCheck, FaExclamation } from "react-icons/fa6";

const useJoinRoom = () => {
  const { push } = useRouter();

  //TODO Make notification reusable for other hooks
  const { mutate, isLoading } = api.liveblocks.searchingRoom.useMutation({
    onSuccess: async (room) => {
      notifications.update({
        id: "searching-room",
        title: "Room Found",
        message: "Redirecting you to the room",
        autoClose: 3000,
        color: "teal",
        loading: false,
        icon: <FaCheck />,
        withCloseButton: false,
      });
      await push(`/room/${room?.id}`);
    },
    onError: (error) => {
      notifications.update({
        id: "searching-room",
        icon: <FaExclamation />,
        title: "Room Not Available",
        message: error.message,
        autoClose: 3000,
        loading: false,
        color: "red",
        withCloseButton: false,
      });
    },
    onMutate: () => {
      notifications.show({
        id: "searching-room",
        title: "Searching for Room",
        message: "Please wait while we search for the room",
        autoClose: false,
        loading: true,
        withCloseButton: false,
      });
    },
  });

  const openJoinRoomModal = () => {
    modals.open({
      withCloseButton: false,
      centered: true,
      trapFocus: true,
      size: "sm",
      children: <RoomModalForm mutate={mutate} />,
    });
  };

  return { openJoinRoomModal, isLoading };
};

//* Currently This is the Best Way
const RoomModalForm = ({
  mutate,
}: {
  mutate: ({ roomId }: { roomId: string }) => void;
}) => {
  const { getInputProps, onSubmit, errors } = useForm({
    mode: "uncontrolled",
    initialValues: { roomId: "" },
    validate: { roomId: hasLength({ min: 1, max: 6 }, "Invalid Room PIN") },
  });

  useEffect(() => {
    if (errors.roomId)
      notifications.show({
        title: "Invalid Room PIN",
        message: "Please enter a valid Room PIN",
        color: "red",
      });
  }, [errors.roomId]);

  return (
    <form
      onSubmit={onSubmit(({ roomId }) => {
        mutate({ roomId }), modals.closeAll();
      })}
    >
      <Stack ta="center" align="center">
        <Title order={2}>{`Room PIN`}</Title>
        <PinInput value="" fw={500} length={6} {...getInputProps("roomId")} />
        <Button type="submit">Enter Room</Button>
      </Stack>
    </form>
  );
};

export default useJoinRoom;
