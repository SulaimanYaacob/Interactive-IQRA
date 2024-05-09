import {
  Button,
  Divider,
  FocusTrap,
  PinInput,
  Stack,
  Text,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { hasLength, useForm } from "@mantine/form";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";
import {
  errorProps,
  successProps,
  mutateProps,
} from "~/utils/notificationProps";

const useJoinRoom = () => {
  const { push } = useRouter();

  //TODO Make notification reusable for other hooks
  const { mutate, isLoading } = api.liveblocks.searchingRoom.useMutation({
    onMutate: () => {
      notifications.show({
        id: "searching-room",
        title: "Searching for Room",
        message: "Please wait while we search for the room",
        ...mutateProps,
      });
    },
    onSuccess: async (room) => {
      notifications.update({
        id: "searching-room",
        title: "Room Found",
        message: "Redirecting you to the room",
        ...successProps,
      });
      await push(`/room/${room?.id}`);
    },
    onError: (error) => {
      notifications.update({
        id: "searching-room",
        title: "Unable to join room",
        message: error.message,
        ...errorProps,
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
  mutate: ({ roomPIN }: { roomPIN: string }) => void;
}) => {
  const { getInputProps, onSubmit, errors } = useForm({
    mode: "uncontrolled",
    initialValues: { roomPIN: "" },
    validate: { roomPIN: hasLength({ min: 6, max: 6 }, "Invalid Room PIN") },
  });

  useEffect(() => {
    if (errors.roomPIN)
      notifications.show({
        title: "Invalid Room PIN",
        message: "Please enter a valid Room PIN",
        color: "red",
      });
  }, [errors.roomPIN]);

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

export default useJoinRoom;
