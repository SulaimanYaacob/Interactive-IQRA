import { Select, type SelectProps } from "@mantine/core";
import { generateTimeListFromNumber } from "~/utils/generateTimeList";

// TODO: Add working hour (Currently Hardcoded).
interface Props extends SelectProps {
  startTime?: number;
  endTime?: number;
  value?: string;
}

function AppointmentTimeInput({
  value,
  startTime = 8,
  endTime = 18,
  ...rest
}: Props) {
  const timeList = generateTimeListFromNumber(startTime, endTime, "30m");

  return (
    <Select
      searchable
      {...rest}
      data={timeList.map(({ label, formattedValue }) => ({
        value: formattedValue,
        label: label,
      }))}
      value={value}
    />
  );
}

export default AppointmentTimeInput;
