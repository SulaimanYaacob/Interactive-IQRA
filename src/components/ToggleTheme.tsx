"use client";

import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import type { IconType } from "react-icons/lib";

type Props = {
  DarkIcon: IconType;
  LightIcon: IconType;
};
export default function ToggleTheme({ DarkIcon, LightIcon }: Props) {
  const { toggleColorScheme } = useMantineColorScheme();

  return (
    <>
      <ActionIcon
        onClick={() => toggleColorScheme()}
        lightHidden
        variant="transparent"
      >
        <DarkIcon size="24" />
      </ActionIcon>
      <ActionIcon
        onClick={() => toggleColorScheme()}
        darkHidden
        variant="transparent"
      >
        <LightIcon size="24" />
      </ActionIcon>
    </>
  );
}
