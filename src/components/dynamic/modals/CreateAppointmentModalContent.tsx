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
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { type FC } from "react";
import AppointmentTimeInput from "~/components/AppointmentTimeInput";
import type { CreateAppointmentInput } from "~/server/api/routers/appointmentRouter";
import type { ClerkPublicMetadata } from "~/types/publicMetadata";
import { daysObject } from "~/utils/constants";
import getAvailabilityTime from "~/utils/getAvailabilityTime";

//TODO Add pricing based on duration of appointment
interface CreateAppointmentModalContentProps {
  mutate: (input: CreateAppointmentInput) => void;
  availability: ClerkPublicMetadata["availability"];
}

const CreateAppointmentModalContent: FC<CreateAppointmentModalContentProps> = ({
  mutate,
  availability,
}) => {
  const { query } = useRouter();
  const { userId: tutorClerkId } = query as { userId: string };

  const {
    getInputProps,
    values,
    onSubmit,
    isValid,
    clearErrors,
    setFieldValue,
  } = useForm<CreateAppointmentInput>({
    initialValues: {
      tutorClerkId,
      date: undefined,
      startTime: "",
      endTime: "",
      comments: "",
    },
    validate: (values) => validateForm(values),
    validateInputOnChange: true,
    onValuesChange: () => isValid() && clearErrors(),
  });

  const validateForm = (values: CreateAppointmentInput) => ({
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
  });

  console.log(values);

  const renderAvailability = () => {
    return Object.values(daysObject).map(({ index, name: day }) => {
      const { endTime, startTime, isAvailable } = getAvailabilityTime({
        availability,
        day,
      });

      if (isAvailable && index === values.date?.getDay()) {
        return (
          <Group key={index} justify="center" gap="xs" py="xs" c="blue">
            <Text fw="500" tt="capitalize">{`${day} from `}</Text>
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
      }

      if (!isAvailable && index === values.date?.getDay()) {
        return (
          <Text key={index} p="xs" tt="capitalize" c="red" fw="500">
            {`Not Available on ${day}`}
          </Text>
        );
      }
    });
  };

  const renderTimeInputs = () => {
    return Object.values(daysObject).map(({ index, name: day }) => {
      const { startTimeValue, endTimeValue, isAvailable } = getAvailabilityTime(
        {
          availability,
          day,
        }
      );

      return (
        isAvailable &&
        values.date?.getDay() === index && (
          <Group grow key={index}>
            <AppointmentTimeInput
              label="Start Time"
              startTime={startTimeValue}
              endTime={endTimeValue}
              {...getInputProps("startTime")}
            />
            <AppointmentTimeInput
              startTime={startTimeValue}
              endTime={endTimeValue}
              label="End Time"
              {...getInputProps("endTime")}
            />
          </Group>
        )
      );
    });
  };

  const unavailableDaysSet = new Set(
    Object.values(daysObject)
      .filter(
        ({ name }) =>
          !getAvailabilityTime({ availability, day: name }).isAvailable
      )
      .map(({ index }) => index)
  );

  return (
    <form
      onSubmit={onSubmit((val) => {
        mutate(val);
        modals.closeAll();
      })}
    >
      <Stack>
        <Box ta="center">
          {renderAvailability()}
          <Divider />
        </Box>
        <Stack align="center">
          <DatePicker
            onClick={() => {
              setFieldValue("startTime", "");
              setFieldValue("endTime", "");
              clearErrors();
            }}
            value={values.date}
            {...getInputProps("date")}
            minDate={dayjs().add(1, "day").toDate()}
            excludeDate={(date) => unavailableDaysSet.has(date.getDay())}
          />
        </Stack>
        {renderTimeInputs()}
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
