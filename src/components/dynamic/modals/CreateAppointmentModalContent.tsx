import { Button, Group, Stack, Text, Textarea } from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import type { CreateAppointmentInput } from "~/server/api/routers/appointmentRouter";
dayjs.extend(customParseFormat);

const CreateAppointmentModalContent = ({
  mutate,
}: {
  mutate: (input: CreateAppointmentInput) => void;
}) => {
  const { getInputProps, values, onSubmit, errors } =
    useForm<CreateAppointmentInput>({
      initialValues: {
        date: dayjs().add(1, "day").toDate(),
        startTime: "",
        endTime: "",
        comments: "",
      },
      validate: (values) => ({
        startTime:
          values.startTime === ""
            ? "Start Time is required"
            : dayjs(values.startTime, "HH:mm").isSame(
                dayjs(values.endTime, "HH:mm")
              )
            ? "Start Time and End Time must not be the same"
            : dayjs(values.startTime, "HH:mm").isAfter(
                dayjs(values.endTime, "HH:mm")
              )
            ? "Start Time must be before End Time"
            : null,

        endTime:
          values.endTime === ""
            ? "End Time is required"
            : dayjs(values.endTime, "HH:mm").isSame(
                dayjs(values.startTime, "HH:mm")
              )
            ? "Start Time and End Time must not be the same"
            : dayjs(values.endTime, "HH:mm").isBefore(
                dayjs(values.startTime, "HH:mm")
              )
            ? "End Time must be after Start Time"
            : null,
        date: values.date == null ? "Please Enter Date" : null,
        comments: values.comments!.length > 300 ? "Max 300 characters" : null,
      }),
    });

  console.log(values.date);

  return (
    <form
      onSubmit={onSubmit((val) => {
        mutate(val), modals.closeAll();
      })}
    >
      <Stack>
        <Stack align="center">
          {errors.date && (
            <Text size="sm" c="red">
              {errors.date}
            </Text>
          )}
          <DatePicker
            value={values.date}
            {...getInputProps("date")}
            minDate={dayjs().add(1, "day").toDate()}
          />
        </Stack>
        <Group grow>
          <TimeInput
            label="Start Time"
            {...getInputProps("startTime")}
            onClick={(e) => e.currentTarget.showPicker()}
          />
          <TimeInput
            label="End Time"
            {...getInputProps("endTime")}
            onClick={(e) => e.currentTarget.showPicker()}
          />
        </Group>
        <Textarea
          autosize
          maxRows={4}
          minRows={2}
          {...getInputProps("comments")}
          label={`Comments (${
            300 - Number(values.comments?.length)
          } Characters Left)`}
          error={Number(values.comments?.length) > 300 && "Comments too long"}
        />
        <Button type="submit">Book Appointment</Button>
      </Stack>
    </form>
  );
};

export default CreateAppointmentModalContent;

//TODO Price? Session Length?
