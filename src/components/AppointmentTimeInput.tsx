import { Select, type SelectProps } from "@mantine/core";
import { generateTimeListFromNumber } from "~/utils/generateTimeList";

// TODO: Add working hour (Currently Hardcoded).
interface Props extends SelectProps {
  startTime?: number;
  endTime?: number;
  value?: string;
}

function AppointmentTimeInput({ value, startTime, endTime, ...rest }: Props) {
  const timeList = generateTimeListFromNumber(
    startTime ?? 8,
    endTime ?? 18,
    "30m"
  );

  return (
    <Select
      allowDeselect={false}
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
