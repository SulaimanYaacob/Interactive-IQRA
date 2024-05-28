import { Center, Stack } from "@mantine/core";
import { DatePicker } from "@mantine/dates";

const DummyPage = () => {
  console.log(new Date(new Date().getFullYear(), 0, 10));
  const wed = "0";

  return (
    <Stack>
      <Center w="100%" pos="absolute" mih="100vh" top={0}>
        <DatePicker
          getDayProps={(day) => ({
            style: {
              background: day.getDay() === 1 ? "red" : "",
            },
          })}
          onChange={(v) => console.log(String(v?.getDay()))}
        />
      </Center>
    </Stack>
  );
};

export default DummyPage;
