import {
  Badge,
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Group,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import dayjs from "dayjs";
import type { CreateAppointmentInput } from "~/server/api/routers/appointmentRouter";
import type { ClerkPublicMetadata } from "~/types/publicMetadata";
import { daysObject } from "~/utils/constants";
import getAvailabilityTime from "~/utils/getAvailabilityTime";

const CreateAppointmentModalContent = ({
  mutate,
  availability,
}: {
  mutate: (input: CreateAppointmentInput) => void;
  availability: ClerkPublicMetadata["availability"];
}) => {
  const { getInputProps, values, onSubmit, isValid } =
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
            ? "Times must differ"
            : dayjs(values.startTime, "HH:mm").isAfter(
                dayjs(values.endTime, "HH:mm")
              )
            ? "Start must be before End"
            : null,

        endTime:
          values.endTime === ""
            ? "End Time is required"
            : dayjs(values.endTime, "HH:mm").isSame(
                dayjs(values.startTime, "HH:mm")
              )
            ? "Times must differ"
            : dayjs(values.endTime, "HH:mm").isBefore(
                dayjs(values.startTime, "HH:mm")
              )
            ? "End must be after Start"
            : null,
        date: values.date == null ? "Please Enter Date" : null,
        comments: values.comments!.length > 300 ? "Max 300 characters" : null,
      }),
      validateInputOnChange: true,
    });

  return (
    <form
      onSubmit={onSubmit((val) => {
        mutate(val), modals.closeAll();
      })}
    >
      <Stack>
        <Box ta="center">
          {Object.values(daysObject).map(({ index, name: day }) => {
            const { endTime, startTime, isAvailable } = getAvailabilityTime({
              availability,
              day,
            });

            if (isAvailable && index === values.date.getDay())
              return (
                <Group key={index} justify="center" gap="xs" py="xs" c="blue">
                  <Text fw="500" tt="capitalize">
                    {`${day} from `}
                  </Text>
                  <Breadcrumbs separator="-">
                    <Badge radius="xs" size="lg">
                      {startTime}
                    </Badge>
                    <Badge size="lg" radius="xs">
                      {endTime}
                    </Badge>
                  </Breadcrumbs>
                </Group>
              );

            if (!isAvailable && index === values.date.getDay())
              return (
                <Text key={index} p="xs" tt="capitalize" c="red" fw="500">
                  {`Not Available on ${day}`}
                </Text>
              );
          })}
          <Divider />
        </Box>
        <Stack align="center">
          <DatePicker
            value={values.date}
            {...getInputProps("date")}
            minDate={dayjs().add(1, "day").toDate()}
            // excludeDate={(date) => }
          />
        </Stack>
        <Group grow>
          <TimeInput
            label="Start Time"
            {...getInputProps("startTime")}
            onClick={(e) => e.currentTarget.showPicker()}
          />
          <TimeInput
            minTime="08:00"
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
        />
        <Button type="submit" disabled={!isValid()}>
          Book Appointment
        </Button>
      </Stack>
    </form>
  );
};

export default CreateAppointmentModalContent;

//TODO Price? Session Length?
