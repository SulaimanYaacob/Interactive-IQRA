import { FaPen } from "react-icons/fa6";
import { ROLE } from "~/utils/constants";
import { useSession } from "@clerk/nextjs";
import useEditProfileDetail from "~/hooks/useEditProfileDetail";
import { ActionIcon, Button } from "@mantine/core";
import useEditProfileAvailability from "~/hooks/useEditProfileAvailability";

type Props = {
  profileId: string;
  profileRole: ROLE;
  type: "availability" | "detail";
};

const ProfileButton = ({ profileId, profileRole, type }: Props) => {
  const { session } = useSession();
  const isCurrentUser = session?.user.id === profileId;
  const { openEditDetailModal } = useEditProfileDetail();
  const { openEditAvailabilityModal } = useEditProfileAvailability();

  if (!session) return null;

  //* other users browsing tutor profile can book an appointment that only appears on detail section
  if (!isCurrentUser && type === "detail" && profileRole === ROLE.TUTOR)
    return <Button>Book Appointment</Button>;

  //* user browsing their own profile can edit their profile
  if (isCurrentUser && type === "detail")
    return (
      <ActionIcon
        onClick={() => openEditDetailModal()}
        size="lg"
        right={0}
        variant="light"
        pos={{ base: "absolute", xs: "relative" }}
      >
        <FaPen />
      </ActionIcon>
    );

  //* user browsing their own profile can edit their availability
  if (isCurrentUser && type === "availability")
    return (
      <ActionIcon
        onClick={() => openEditAvailabilityModal()}
        size="lg"
        right={0}
        variant="light"
        pos={{ base: "absolute", xs: "relative" }}
      >
        <FaPen />
      </ActionIcon>
    );
};

export default ProfileButton;
