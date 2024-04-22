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
        color="yellow"
        onClick={() => toggleColorScheme()}
        lightHidden
        variant="transparent"
      >
        <LightIcon size="32" />
      </ActionIcon>
      <ActionIcon
        onClick={() => toggleColorScheme()}
        darkHidden
        variant="transparent"
      >
        <DarkIcon size="32" />
      </ActionIcon>
    </>
  );
}
