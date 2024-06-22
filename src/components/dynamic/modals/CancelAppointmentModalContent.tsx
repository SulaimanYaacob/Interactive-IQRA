import {
  Button,
  Center,
  Checkbox,
  Stack,
  Textarea,
  Title,
} from "@mantine/core";
import { hasLength, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { useState } from "react";
import { FaCircleExclamation } from "react-icons/fa6";
import type { CancelAppointmentInput } from "~/server/api/routers/appointmentRouter";

function CancelAppointmentModalContent({
  mutate,
  appointmentId,
}: {
  mutate: (input: CancelAppointmentInput) => void;
  appointmentId: string;
}) {
  const [approveCancel, setApproveCancel] = useState<boolean>();
  const { onSubmit, getInputProps, values } = useForm<CancelAppointmentInput>({
    initialValues: {
      appointmentId: appointmentId ?? "",
      cancelReason: "",
    },
    validate: {
      cancelReason: hasLength(
        { max: 300 },
        "Reason must be under 300 characters"
      ),
    },
  });

  return (
    <form
      onSubmit={onSubmit((val) => {
        modals.closeAll();
        mutate(val);
      })}
    >
      <Stack p="md">
        <Center>
          <FaCircleExclamation
            color="var(--mantine-color-red-4)"
            size="128px"
          />
        </Center>
        <Title order={2} ta="center">
          Cancel This Appointment?
        </Title>
        <Center>
          <Checkbox
            onChange={(e) => setApproveCancel(e.currentTarget.checked)}
            label="I want to cancel this appointment"
          />
        </Center>
        {approveCancel && (
          <Textarea
            autosize
            maxRows={4}
            minRows={2}
            placeholder="Why do you want to cancel this appointment?"
            label={`Reason for Cancellation (${
              300 - Number(values.cancelReason?.length)
            } Characters Left)`}
            {...getInputProps("cancelReason")}
          />
        )}
        <Button color="red" type="submit" disabled={!approveCancel}>
          Cancel Appointment
        </Button>
      </Stack>
    </form>
  );
}

export default CancelAppointmentModalContent;
