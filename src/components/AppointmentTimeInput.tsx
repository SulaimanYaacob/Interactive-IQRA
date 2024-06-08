import { Select, type SelectProps } from "@mantine/core";
import {
  generateTimeListFromNumber,
  get12HourTimeFormat,
} from "~/utils/dateHandler";

// TODO: Add working hour (Currently Hardcoded).
interface Props extends SelectProps {
  startTime?: number;
  endTime?: number;
  value?: string;
  usage?: "1hrBooking" | "2hrBooking";
  bookedAppointmentTimes?: string[];
}

function AppointmentTimeInput({
  value,
  startTime,
  usage,
  endTime,
  bookedAppointmentTimes,
  ...rest
}: Props) {
  const timeList = generateTimeListFromNumber({
    start: startTime ?? 8,
    end: endTime ?? 18,
    range: "1hr",
    usage,
    bookedAppointmentTimes,
  });

  console.log(timeList);

  return (
    <Select
      allowDeselect={false}
      searchable
      {...rest}
      data={timeList.map(({ label, disabled }) => ({
        value: get12HourTimeFormat(label),
        label: label,
        disabled,
      }))}
      value={value}
    />
  );
}

export default AppointmentTimeInput;
