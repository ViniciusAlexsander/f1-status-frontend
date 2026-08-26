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
  return (
    <Box
      display={{ base: "block", xl: "none" }}
      position="sticky"
      top={{ base: "5.25rem", md: "3.6rem" }}
      zIndex="20"
      mx={{ base: -4, md: -6 }}
      overflowX="auto"
      borderYWidth="1px"
      borderColor="border"
      bg="bg/95"
      px={{ base: 4, md: 6 }}
      backdropFilter="blur(12px)"
    >
      <HStack gap="1px" minW="max-content">
        {tabs.map((tab) => {
          const active = tab.id === value;
          return (
            <Button
              key={tab.id}
              role="tab"
              aria-selected={active}
              variant="ghost"
              position="relative"
              h="auto"
              minW="max-content"
              px="3.5"
              py="2.5"
              gap="1.5"
              borderRadius="0"
              color={active ? "fg" : "fg.muted"}
              _hover={{ color: "fg" }}
              onClick={() => onChange(tab.id)}
              fontFamily="mono"
              fontSize="11px"
              letterSpacing="0.14em"
              textTransform="uppercase"
            >
              {tab.live && <Box w="1.5" h="1.5" borderRadius="full" bg="f1.500" />}
              {tab.label}
              {active && <Box position="absolute" insetX="2" bottom="0" h="0.5" bg="f1.500" />}
            </Button>
          );
        })}
      </HStack>
    </Box>
  );
}
