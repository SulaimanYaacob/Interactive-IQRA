import { Button, Paper, Stack, Text, Title } from "@mantine/core";
import type { IconType } from "react-icons";
import useCancelApplication from "~/hooks/useCancelApplication";

type Props = {
  Icon: IconType;
  title: string;
  color?: string;
  description: string;
  buttonText?: string;
};

const StatusDisplay = ({
  title,
  color,
  buttonText,
  description,
  Icon,
}: Props) => {
  const { cancelApplication } = useCancelApplication();

  return (
    <Paper withBorder p="md">
      <Stack align="center">
        <Icon color={color} size="128" />
        <Stack align="center" gap="0">
          <Title order={2} ta="center">
            {title}
          </Title>
          <Text c="dimmed" ta="center">
            {description}
          </Text>
        </Stack>
        {buttonText && (
          <Button onClick={() => cancelApplication()} color="red">
            {buttonText}
          </Button>
        )}
      </Stack>
    </Paper>
  );
};

export default StatusDisplay;
