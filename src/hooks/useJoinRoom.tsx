import { modals } from "@mantine/modals";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { notifications } from "@mantine/notifications";
import {
  errorProps,
  successProps,
  mutateProps,
} from "~/utils/notificationProps";
import dynamic from "next/dynamic";
const LazyJoinRoomModalContent = dynamic(
  import("~/components/dynamic-components/modals/JoinRoomModalContent"),
  { ssr: false }
);
const useJoinRoom = () => {
  const { push } = useRouter();

  const { mutate, isLoading } = api.liveblocks.searchingRoom.useMutation({
    onMutate: () => {
      notifications.show({
        id: "search-room",
        title: "Searching for Room",
        message: "Please wait while we search for the room",
        ...mutateProps,
      });
    },
    onSuccess: async (room) => {
      notifications.update({
        id: "search-room",
        title: "Room Found",
        message: "Redirecting you to the room",
        ...successProps,
      });
      await push(`/room/${room?.id}`, undefined, { shallow: false });
    },
    onError: (error) => {
      notifications.update({
        id: "search-room",
        title: "Unable to join room",
        message: error.message,
        ...errorProps,
      });
    },
  });

  const openJoinRoomModal = () => {
    modals.open({
      children: <LazyJoinRoomModalContent mutate={mutate} />,
      withCloseButton: false,
      centered: true,
      size: "sm",
    });
  };

  return { openJoinRoomModal, isLoading };
};

//* Currently This is the Best Way

export default useJoinRoom;
