import { Paper } from "@mantine/core";
import { TimeInput } from "@mantine/dates";

const BookAppointmentModalContent = () => {
  return (
    <Paper>
      <TimeInput onClick={(e) => e.currentTarget.showPicker()} />
    </Paper>
  );
};

export default BookAppointmentModalContent;

//TODO Price? Session Length?
