import type { RaceControlMessage } from "@/api/types/livetiming";
import { Badge, Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { RiMegaphoneLine } from "react-icons/ri";

type RaceControlPanelProps = {
  messages: RaceControlMessage[];
};

export function RaceControlPanel({ messages }: RaceControlPanelProps) {
  return (
    <Box id="race-control-history" scrollMarginTop="24" py={{ base: 2, md: 8 }}>
      <Flex align="center" justify="space-between" mb={{ base: 1.5, md: 4 }} gap="2">
        <Flex align="center" gap={{ base: 2, md: 3 }}>
          <Box color="f1.500" fontSize="xl"><RiMegaphoneLine /></Box>
          <Box>
            <Heading size="md">Race Control</Heading>
            <Text mt="0.5" color="fg.muted" fontSize="xs">
              Histórico desta sessão
            </Text>
          </Box>
        </Flex>
        <Badge colorPalette="gray" variant="subtle" fontFamily="mono">
          {messages.length}
        </Badge>
      </Flex>

      {messages.length === 0 ? (
        <Box borderWidth="1px" borderColor="border" borderRadius="md" p={{ base: 3, md: 5 }}>
          <Text color="fg.muted" fontSize="sm">Nenhuma mensagem de Race Control nesta sessão.</Text>
        </Box>
      ) : (
        <Stack
          gap="2"
          maxH={{ base: "300px", md: "390px" }}
          overflowY="auto"
          overscrollBehaviorY="contain"
          pr="1"
          css={{ scrollbarColor: "var(--chakra-colors-border) transparent" }}
        >
          {[...messages].reverse().map((message, index) => {
            const isPenalty = /penalty|penalidade/i.test(message.Category ?? message.Message ?? "");
            const isTrackLimits = /track limits|limite de pista/i.test(message.Category ?? message.Message ?? "");
            const category = message.Flag ?? message.Category ?? (isPenalty ? "Penalty" : "Race Control");
            const time = message.Utc
              ? new Intl.DateTimeFormat("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                }).format(new Date(message.Utc))
              : "—";

            return (
              <Flex
                key={`${message.Utc ?? ""}-${message.Message ?? index}`}
                align="flex-start"
                gap={{ base: 2, md: 3 }}
                borderWidth="1px"
                borderColor="border"
                borderLeftWidth="3px"
                borderLeftColor={isPenalty ? "red.500" : isTrackLimits ? "orange.500" : "blue.500"}
                borderRadius="md"
                bg="bg.subtle"
                px={{ base: 2, md: 3 }}
                py={{ base: 1.5, md: 3 }}
              >
                <Box flex="1" minW="0">
                  <Flex align="center" justify="space-between" gap="2" mb="1">
                    <Badge colorPalette={isPenalty ? "red" : isTrackLimits ? "orange" : "blue"}>
                      {category}
                    </Badge>
                    <Text flexShrink="0" fontFamily="mono" fontSize="10px" color="fg.muted">
                      {time}
                    </Text>
                  </Flex>
                  <Text fontSize="sm" lineHeight="1.45">
                    {message.Message ?? "Mensagem da direção de prova"}
                  </Text>
                  <Flex mt="1.5" gap="3" color="fg.muted" fontFamily="mono" fontSize="10px">
                    {message.Lap != null && <Text>VOLTA {message.Lap}</Text>}
                    {message.RacingNumber && <Text>CARRO #{message.RacingNumber}</Text>}
                    {message.Scope && <Text>{message.Scope}</Text>}
                  </Flex>
                </Box>
              </Flex>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}
