import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

export const generateTimeListFromNumber = (
  start: number,
  end: number,
  range: "1hr" | "30m" | "15m"
) => {
  const timeListObj: {
    label: string;
    value: number;
    formattedValue: string;
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

    if (index !== -1) {
      timeListObj.splice(index, 1);
    }

    const formattedValue = dayjs
      .duration({
        hours: Math.floor(value),
        minutes: (value - Math.floor(value)) * 60,
      })
      .format("H:mm");

    timeListObj.push({ label, value, formattedValue });

    if (range === "1hr") start += 1;
    else if (range === "30m") start += 0.5;
    else if (range === "15m") start += 0.25;
  }

  return timeListObj;
};

export const generateDateList = (start: Date, end: Date) => {
  const _start = dayjs(start).startOf("day");
  const _end = dayjs(end).startOf("day");

  const dates: Date[] = [];
  let currentDate = _start;

  while (currentDate.isBefore(_end)) {
    dates.push(currentDate.toDate());
    currentDate = currentDate.add(1, "day");
  }

  return dates;
};
