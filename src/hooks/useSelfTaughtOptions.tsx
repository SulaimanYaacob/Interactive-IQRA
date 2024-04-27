import { Button, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { FaBookQuran, FaGears, FaArrowPointer } from "react-icons/fa6";
import { modals } from "@mantine/modals";
import { useRouter } from "next/router";

const selfTaughtOptions = [
  {
    title: "Learn IQRA",
    Icon: FaBookQuran,
    href: "/st/learn-iqra",
    disabled: false,
  },
  {
    title: "Drag & Drop",
    Icon: FaArrowPointer,
    disabled: true,
  },
  {
    title: "Coming Soon",
    Icon: FaGears,
    disabled: true,
  },
  {
    title: "Coming Soon",
    Icon: FaGears,
    disabled: true,
  },
  {
    title: "Coming Soon",
    Icon: FaGears,
    disabled: true,
  },
  {
    title: "Coming Soon",
    Icon: FaGears,
    disabled: true,
  },
];

const useSelfTaughtOptions = () => {
  const openSelfTaughtModal = () => {
    modals.open({
      size: "lg",
      withCloseButton: false,
      centered: true,
      children: <SelfTaughtModalContent />,
    });
  };

  return { openSelfTaughtModal };
};

const SelfTaughtModalContent = () => {
  const { push } = useRouter();

  return (
    <Stack ta="center">
      <Title order={2}>Choose option</Title>
      <SimpleGrid cols={{ base: 2, sm: 3 }}>
        {selfTaughtOptions.map(({ title, Icon, disabled, href }, idx) => (
          <Button
            onClick={async () => {
              modals.closeAll(), await push(href ?? "/");
            }}
            h="auto"
            key={idx}
            p={{ base: "md", xs: "lg" }}
            disabled={disabled}
          >
            <Stack align="center" justify="center">
              <Icon className="mantine-visible-from-xs" size={64} />
              <Icon className="mantine-hidden-from-xs" size={48} />
              <Text
                fz={{ base: "sm", xs: "md" }}
                mt={{ base: "sm", xs: "md" }}
                fw={500}
              >
                {title}
              </Text>
            </Stack>
          </Button>
        ))}
      </SimpleGrid>
    </Stack>
  );
};

export default useSelfTaughtOptions;
