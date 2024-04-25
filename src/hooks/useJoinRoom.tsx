import { Button, PinInput, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

const useJoinRoom = () => {
  const { push } = useRouter();
  const { getInputProps, onSubmit, reset } = useForm({
    mode: "uncontrolled",
    initialValues: {
      roomId: "",
    },
  });

  const { mutate, isLoading } = api.liveblocks.searchingRoom.useMutation({
    onSuccess: async (room) => {
      modals.closeAll();
      await push(`/rooms/${room?.id}`);
    },
    onError: (error) => {
      console.log(error);
    },
    onSettled: () => {
      reset();
    },
  });

  const openJoinRoomModal = () => {
    modals.open({
      size: "sm",
      centered: true,
      withCloseButton: false,
      children: (
        <form
          onSubmit={onSubmit(({ roomId }) => {
            mutate({ roomId }), modals.closeAll();
          })}
        >
          <Stack align="center">
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

  return { openJoinRoomModal, isLoading };
};

export default useJoinRoom;
