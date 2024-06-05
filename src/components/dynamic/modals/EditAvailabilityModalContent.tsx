import { useSession } from "@clerk/nextjs";
import { Breadcrumbs, Button, Group, Stack, Switch } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import dayjs from "dayjs";
import type { EditProfileAvailabilityInput } from "~/server/api/routers/userRouter";
import type { ClerkPublicMetadata } from "~/types/publicMetadata";
import { daysObject } from "~/utils/constants";
import AppointmentTimeInput from "~/components/AppointmentTimeInput";

const EditAvailabilityModalContent = ({
  mutate,
}: {
  mutate: (availabilityInput: EditProfileAvailabilityInput) => void;
}) => {
  const { session } = useSession();
  const availability = session?.user.publicMetadata
    .availability as ClerkPublicMetadata["availability"];
  const { getInputProps, onSubmit, values, isValid } =
    useForm<EditProfileAvailabilityInput>({
      initialValues: {
        mondayAvailability: availability?.mondayAvailability ?? false,
        tuesdayAvailability: availability?.tuesdayAvailability ?? false,
        wednesdayAvailability: availability?.wednesdayAvailability ?? false,
        thursdayAvailability: availability?.thursdayAvailability ?? false,
        fridayAvailability: availability?.fridayAvailability ?? false,
        saturdayAvailability: availability?.saturdayAvailability ?? false,
        sundayAvailability: availability?.sundayAvailability ?? false,
        mondayStart: availability?.mondayStart ?? "",
        mondayEnd: availability?.mondayEnd ?? "",
        tuesdayStart: availability?.tuesdayStart ?? "",
        tuesdayEnd: availability?.tuesdayEnd ?? "",
        wednesdayStart: availability?.wednesdayStart ?? "",
        wednesdayEnd: availability?.wednesdayEnd ?? "",
        thursdayStart: availability?.thursdayStart ?? "",
        thursdayEnd: availability?.thursdayEnd ?? "",
        fridayStart: availability?.fridayStart ?? "",
        fridayEnd: availability?.fridayEnd ?? "",
        saturdayStart: availability?.saturdayStart ?? "",
        saturdayEnd: availability?.saturdayEnd ?? "",
        sundayStart: availability?.sundayStart ?? "",
        sundayEnd: availability?.sundayEnd ?? "",
      },
      validate: (values) => {
        const errors: Record<string, string | null> = {};

        Object.keys(daysObject).forEach((day) => {
          const start = values[`${day}Start` as keyof typeof values] as string;
          const end = values[`${day}End` as keyof typeof values] as string;
          const available = values[`${day}Availability` as keyof typeof values];

          if (available) {
            if (!start) errors[`${day}Start`] = "Start Time is required";
            else if (!end) errors[`${day}End`] = "End Time is required";
            else if (dayjs(start, "HH:mm").isSame(dayjs(end, "HH:mm"))) {
              errors[`${day}Start`] = errors[`${day}End`] = "Times must differ";
            } else if (dayjs(start, "HH:mm").isAfter(dayjs(end, "HH:mm"))) {
              errors[`${day}Start`] = "Start must be before End";
              errors[`${day}End`] = "End must be after Start";
            }
          }
        });

        return errors;
      },
      validateInputOnChange: true,
    });

  return (
    <form
      onSubmit={onSubmit((val) => {
        modals.closeAll();
        mutate(val);
      })}
    >
      <Stack>
        <Stack>
          {Object.keys(daysObject).map((day) => (
            <Group key={day} pos="relative">
              <Stack justify="center">
                <Switch
                  {...getInputProps(`${day}Availability`)}
                  defaultChecked={Boolean(
                    values[`${day}Availability` as keyof typeof values]
                  )}
                  value={day}
                  label={day}
                  styles={{ label: { width: "100px" } }}
                  tt="capitalize"
                  fw="500"
                >
                  {day}
                </Switch>
              </Stack>
              {values[`${day}Availability` as keyof typeof values] && (
                <Breadcrumbs separator="-">
                  <AppointmentTimeInput
                    w={{ base: "auto", xs: "150px" }}
                    value={
                      values[`${day}Start` as keyof typeof values] as string
                    }
                    {...getInputProps(`${day}Start`)}
                  />
                  <AppointmentTimeInput
                    w={{ base: "auto", xs: "150px" }}
                    value={values[`${day}End` as keyof typeof values] as string}
                    {...getInputProps(`${day}End`)}
                  />
                </Breadcrumbs>
              )}
            </Group>
          ))}
        </Stack>
        <Button type="submit" disabled={!isValid()}>
          Update
        </Button>
      </Stack>
    </form>
  );
};

export default EditAvailabilityModalContent;
