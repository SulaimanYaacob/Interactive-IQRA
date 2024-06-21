import { Button, Center } from "@mantine/core";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

const DummyPage = () => {
  const { push } = useRouter();
  const { mutate, data } =
    api.stripe.createAppointmentCheckoutSession.useMutation({
      onSuccess: async (url) => {
        await push(url!);
      },
    });

  console.log(data);
  return (
    <Center mih="75vh">
      <Button onClick={() => mutate()}>Pay Something I Guess</Button>
    </Center>
  );
};

export default DummyPage;
