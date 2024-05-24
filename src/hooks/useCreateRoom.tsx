import {
  errorProps,
  mutateProps,
  successProps,
} from "~/utils/notificationProps";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import dynamic from "next/dynamic";
const LazyCreateRoomModalContent = dynamic(
  import("~/components/dynamic/modals/CreateRoomModalContent"),
  { ssr: false }
);

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
      children: <LazyCreateRoomModalContent mutate={mutate} />,
    });
  };

  return { openSelfTaughtModal };
};

export default useCreateRoom;
