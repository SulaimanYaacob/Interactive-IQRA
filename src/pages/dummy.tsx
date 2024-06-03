import { DatePickerInput, TimeInput } from "@mantine/dates";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useState } from "react";

dayjs.extend(customParseFormat);

const DummyPage = () => {
  const [date, setDate] = useState<Date | null>();

  return (
    <>
      <DatePickerInput onChange={(v) => setDate(v)} value={date} />
      <TimeInput onClick={(e) => e.currentTarget.showPicker()} />
    </>
  );
};

export default DummyPage;
