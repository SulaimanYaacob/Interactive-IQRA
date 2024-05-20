import { useSession } from "@clerk/nextjs";
import { ActionIcon, Button } from "@mantine/core";
import { FaPen } from "react-icons/fa6";
import { ROLE } from "~/utils/constants";

type Props = {
  profileId: string;
  profileRole: ROLE;
};

const ProfileButton = ({ profileId, profileRole }: Props) => {
  const { session } = useSession();
  const isCurrentUser = session?.user.id === profileId;

  if (!session) return null;

  //* other users browsing tutor profile can only book an appointment
  if (!isCurrentUser && profileRole === ROLE.TUTOR)
    return <Button>Book Appointment</Button>;

  //* user browsing their own profile can edit their profile
  if (isCurrentUser)
    return (
      <ActionIcon variant="light" size="lg">
        <FaPen />
      </ActionIcon>
    );
};

export default ProfileButton;
