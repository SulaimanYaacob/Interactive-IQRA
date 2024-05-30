import { useSession } from "@clerk/nextjs";
import { Button, Chip, Group, SimpleGrid, Stack } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import type { EditProfileAvailabilityInput } from "~/server/api/routers/userRouter";
import type { ClerkPublicMetadata } from "~/types/publicMetadata";
import { daysObject } from "~/utils/constants";

const EditAvailabilityModalContent = ({
  mutate,
}: {
  mutate: (availabilityInput: EditProfileAvailabilityInput) => void;
}) => {
  const { session } = useSession();
  const availability = session?.user.publicMetadata
    .availability as ClerkPublicMetadata["availability"];
  const { getInputProps, onSubmit, values } =
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
      validate: Object.fromEntries(
        Object.keys(daysObject).flatMap((day) => [
          [
            `${day}Start`,
            (val: string) => {
              if (values[`${day}Availability` as keyof typeof values])
                return val ? null : "Required";
            },
          ],
          [
            `${day}End`,
            (val: string) => {
              if (values[`${day}Availability` as keyof typeof values])
                return val ? null : "Required";
            },
          ],
        ])
      ),
    });

  //TODO Change to accordion with Switch / Checkbox
  return (
    <form onSubmit={onSubmit((val) => mutate(val))}>
      <Stack>
        <SimpleGrid
          spacing={{ base: "xs", sm: "md" }}
          cols={{ base: 1, sm: 3 }}
        >
          {Object.keys(daysObject).map((day) => (
            <Stack key={day}>
              <Chip
                {...getInputProps(`${day}Availability`)}
                defaultChecked={Boolean(
                  values[`${day}Availability` as keyof typeof values]
                )}
                value={day}
                styles={(t) => ({
                  label: {
                    width: "100%",
                    // color: t.colors.gray[0],
                    // background: values[
                    //   `${day}Availability` as keyof typeof values
                    // ]
                    //   ? t.colors.blue[7]
                    //   : t.colors.red[7],
                  },
                })}
                tt="capitalize"
                fw="500"
              >
                {day}
              </Chip>
              {values[`${day}Availability` as keyof typeof values] && (
                <Group gap="xs" grow>
                  <TimeInput
                    label="Start Time"
                    withAsterisk
                    value=""
                    {...getInputProps(`${day}Start`)}
                  />
                  <TimeInput
                    label="End Time"
                    withAsterisk
                    {...getInputProps(`${day}End`)}
                  />
                </Group>
              )}
            </Stack>
          ))}
        </SimpleGrid>
        <Button type="submit">Update</Button>
      </Stack>
    </form>
  );
};

export default EditAvailabilityModalContent;
