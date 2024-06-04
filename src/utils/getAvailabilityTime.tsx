import dayjs from "dayjs";
import type { ClerkPublicMetadata } from "~/types/publicMetadata";

type Props = {
  availability: ClerkPublicMetadata["availability"];
  day: string;
};

const getAvailabilityTime = ({ availability, day }: Props) => {
  const availabilityKey = `${day}Availability` as keyof typeof availability;
  const startKey = `${day}Start` as keyof typeof availability;
  const endKey = `${day}End` as keyof typeof availability;

  const startTime = dayjs(String(availability?.[startKey]), "HH:mm").format(
    "hh:mm A"
  );

  const endTime = dayjs(String(availability?.[endKey]), "HH:mm").format(
    "hh:mm A"
  );

  const isAvailable = Boolean(availability?.[availabilityKey]);

  return { isAvailable, startTime, endTime, startKey, endKey, availabilityKey };
};

export default getAvailabilityTime;
