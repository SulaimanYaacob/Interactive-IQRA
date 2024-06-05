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

  const startTimeValue =
    dayjs(startTime, "hh A").hour() + dayjs(startTime, "HH:mm A").minute() / 60;

  const endTimeValue =
    dayjs(endTime, "hh A").hour() + dayjs(endTime, "HH:mm A").minute() / 60;

  const isAvailable = Boolean(availability?.[availabilityKey]);

  return {
    endTime,
    startTime,
    endTimeValue,
    startTimeValue,
    endKey,
    startKey,
    isAvailable,
    availabilityKey,
  };
};

export default getAvailabilityTime;
