import { FaPen } from "react-icons/fa6";
import { ROLE } from "~/utils/constants";
import { useSession } from "@clerk/nextjs";
import useEditProfileDetail from "~/hooks/useEditProfileDetail";
import { ActionIcon, Button } from "@mantine/core";
import useEditProfileAvailability from "~/hooks/useEditProfileAvailability";
import useCreateAppointment from "~/hooks/useCreateAppointment";
import type { User } from "@clerk/nextjs/dist/types/server";
import type { ClerkPublicMetadata } from "~/types/publicMetadata";
import type { BookedAppointments } from "~/pages/profile/[userId]";

type Props = {
  userProfile: User;
  type: "availability" | "detail";
  bookedAppointments?: BookedAppointments[];
};

const ProfileButton = ({ userProfile, type, bookedAppointments }: Props) => {
  const { session } = useSession();
  const { role: profileRole, availability } =
    userProfile.publicMetadata as unknown as ClerkPublicMetadata;

  const isCurrentUser = session?.user.id === userProfile.id;
  const { openEditDetailModal } = useEditProfileDetail();
  const { openEditAvailabilityModal } = useEditProfileAvailability();
  const { openCreateAppointmentModal, isLoading: sendingAppointment } =
    useCreateAppointment();

  if (!session) return null;

  const { role: sessionRole } = session?.user
    .publicMetadata as unknown as ClerkPublicMetadata;

  //* other users browsing tutor profile can book an appointment that only appears on detail section
  if (
    !isCurrentUser &&
    type === "detail" &&
    profileRole === ROLE.TUTOR
    // &&!sessionRole
  )
    return (
      <Button
        loading={sendingAppointment}
        onClick={() =>
          openCreateAppointmentModal({ availability, bookedAppointments })
        }
      >
        Book Appointment
      </Button>
    );

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
