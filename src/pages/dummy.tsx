import { Center, Stack } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const DummyPage = () => {
  return (
    <Stack>
      <Center w="100%" pos="absolute" mih="100vh" top={0}>
        <TimeInput
          onChange={(v) =>
            console.log(dayjs(v.currentTarget.value, "HH:mm").format("h:mm A"))
          }
        />
      </Center>
    </Stack>
  );
};

export default DummyPage;
