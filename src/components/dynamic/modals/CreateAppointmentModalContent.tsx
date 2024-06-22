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
import type { BookedAppointments } from "~/pages/profile/[userId]";
import type { CreateAppointmentInput } from "~/server/api/routers/appointmentRouter";
import type { ClerkPublicMetadata } from "~/types/publicMetadata";
import { daysObject } from "~/utils/constants";
import {
  generateTimeListFromNumber,
  getAvailabilityTime,
} from "~/utils/dateHandler";

//TODO Add pricing based on duration of appointment
interface CreateAppointmentModalContentProps {
  mutate: (input: CreateAppointmentInput) => void;
  availability: ClerkPublicMetadata["availability"];
  bookedAppointments?: BookedAppointments[];
}

const CreateAppointmentModalContent: FC<CreateAppointmentModalContentProps> = ({
  mutate,
  availability,
  bookedAppointments,
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
    startTime: values.startTime === "" ? "Please Enter Start Time" : null,
    date: values.date == null ? "Please Enter Date" : null,
    comments: values.comments!.length > 300 ? "Max 300 characters" : null,
  });

  const bookedAppointmentTimes = ({ index }: { index: number }) =>
    bookedAppointments?.map(({ date, startTime }) => {
      if (date === values.date?.toISOString() && index === dayjs(date).day()) {
        return startTime;
      }
    });

  const unavailableDaysSet = (calendarDate: Date) =>
    new Set(
      Object.values(daysObject)
        .filter(({ name }) => {
          const filteredBookedTime = bookedAppointments
            ?.filter((appointment) =>
              dayjs(appointment.date).isSame(calendarDate)
            )
            .map((appointment) => appointment.startTime);

          const { startTimeValue, endTimeValue, isAvailable } =
            getAvailabilityTime({
              availability,
              day: name,
            });

          if (!isAvailable) return true;

          const timeList = generateTimeListFromNumber({
            start: startTimeValue,
            end: endTimeValue,
            range: "1hr",
            usage: "1hrBooking",
            bookedAppointmentTimes: filteredBookedTime,
          });

          const allSlotsBooked = timeList.length === filteredBookedTime?.length;

          return allSlotsBooked;
        })
        .map(({ index }) => index)
    );

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
              bookedAppointmentTimes={
                bookedAppointmentTimes({ index }) as string[]
              }
              usage="1hrBooking"
              label="Book an Hour Session From"
              startTime={startTimeValue}
              endTime={endTimeValue}
              {...getInputProps("startTime")}
            />
          </Group>
        )
      );
    });
  };

  return (
    <form
      onSubmit={onSubmit(({ startTime, ...val }) => {
        const formattedEndTime = dayjs(startTime, "hh:mm A")
          .add(1, "hour")
          .format("hh:mm A");
        mutate({
          ...val,
          startTime,
          endTime: formattedEndTime,
        });
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
            excludeDate={(date) => unavailableDaysSet(date).has(date.getDay())}
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
