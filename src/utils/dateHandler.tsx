import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import type { ClerkPublicMetadata } from "~/types/publicMetadata";
dayjs.extend(duration);
dayjs.extend(relativeTime);

type AvailabilityTimeProps = {
  availability: ClerkPublicMetadata["availability"];
  day: string;
};

type GenerateTimeListProps = {
  start: number;
  end: number;
  range: "1hr" | "30m" | "15m";
  usage?: "1hrBooking" | "2hrBooking";
  bookedAppointmentTimes?: string[];
};

export const generateTimeListFromNumber = ({
  start,
  end,
  range,
  usage,
  bookedAppointmentTimes,
}: GenerateTimeListProps) => {
  const timeListObj: {
    label: string;
    value: number;
    disabled?: boolean;
  }[] = [];

  while (start <= end) {
    let hour = Math.floor(start);
    let minute: number | string = Math.round((start - hour) * 60);
    let period = "AM";

    // Set Period to PM if hour is >= 12
    if (hour >= 12 && hour < 24) period = "PM";
    // Convert 24 hour time to 12 hour time
    if (hour > 12) hour -= 12;
    // 0 === 12 AM
    if (hour === 0) hour = 12;
    //set the default minute to 00
    if (minute < 10) {
      minute = `0${minute}`;
    }

    const label = `${hour}:${minute} ${period}`;

    if (period === "AM" && hour === 12) hour = 24;
    if (period === "PM" && hour !== 12) hour += 12;

    const value = hour + (minute as number) / 60;

    //remove duplicate value and label
    const index = timeListObj.findIndex(
      (obj) => obj.value === value && obj.label === label
    );

    if (index !== -1) timeListObj.splice(index, 1);

    // TODO: Add booked appointment time check

    if (bookedAppointmentTimes?.includes(get12HourTimeFormat(label))) {
      timeListObj.push({ label, value, disabled: true });
    } else {
      timeListObj.push({ label, value });
    }

    // const formattedValue = dayjs
    //   .duration({
    //     hours: Math.floor(value),
    //     minutes: (value - Math.floor(value)) * 60,
    //   })
    //   .format("H:mm");

    if (range === "1hr") start += 1;
    else if (range === "30m") start += 0.5;
    else if (range === "15m") start += 0.25;
  }

  //! Hardcoded for 1 hour session (Remove last value)
  if (usage === "1hrBooking") timeListObj.pop();

  return timeListObj;
};

export const getAvailabilityTime = ({
  availability,
  day,
}: AvailabilityTimeProps) => {
  const availabilityKey = `${day}Availability` as keyof typeof availability;
  const startKey = `${day}Start` as keyof typeof availability;
  const endKey = `${day}End` as keyof typeof availability;

  const startTime = dayjs(String(availability?.[startKey]), "HH:mm A").format(
    "hh:mm A"
  );

  const endTime = dayjs(String(availability?.[endKey]), "HH:mm A").format(
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

export const get12HourTimeFormat = (time: string) => {
  return dayjs(time, "hh:mm A").format("hh:mm A");
};

export const getTimeFromNow = (date: Date) => {
  return dayjs(date).fromNow();
};
