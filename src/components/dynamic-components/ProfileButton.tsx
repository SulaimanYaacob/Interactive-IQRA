import { FaPen } from "react-icons/fa6";
import { ROLE } from "~/utils/constants";
import { useSession } from "@clerk/nextjs";
import useEditProfile from "~/hooks/useEditProfile";
import { ActionIcon, Button } from "@mantine/core";

type Props = {
  profileId: string;
  profileRole: ROLE;
};

const ProfileButton = ({ profileId, profileRole }: Props) => {
  const { openEditProfileModal } = useEditProfile();
  const { session } = useSession();
  const isCurrentUser = session?.user.id === profileId;

  if (!session) return null;

  //* other users browsing tutor profile can book an appointment
  if (!isCurrentUser && profileRole === ROLE.TUTOR)
    return <Button>Book Appointment</Button>;

  //* user browsing their own profile can edit their profile
  if (isCurrentUser)
    return (
      <ActionIcon
        onClick={() => openEditProfileModal()}
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
