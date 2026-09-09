import { Box, Button, HStack } from "@chakra-ui/react";

export type ViewTab = {
  id: string;
  label: string;
  live?: boolean;
};

type ViewTabsProps = {
  tabs: ViewTab[];
  value: string;
  onChange: (id: string) => void;
};

export function ViewTabs({ tabs, value, onChange }: ViewTabsProps) {
  return null;
}
