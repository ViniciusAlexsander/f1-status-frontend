import { NextRacePanel } from "@/pages/Home/components/HomePanels";
import type { RaceWeek, Schedule } from "@/api/types/race";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";

type UpcomingSessionBannerProps = {
  nextScheduledSession?: Schedule;
  nextSessionRace?: RaceWeek;
};

export function UpcomingSessionBanner({
  nextScheduledSession,
  nextSessionRace,
}: UpcomingSessionBannerProps) {
  return (
    <Flex
      w="full"
      minH="calc(100dvh - 72px)"
      align="center"
      justify="center"
      px={{ base: 3, md: 8 }}
      py={{ base: 6, md: 12 }}
    >
      <Box w="full" maxW="1100px">
        {nextScheduledSession && nextSessionRace ? (
          <NextRacePanel
            race={nextSessionRace}
            focusedSession={nextScheduledSession}
          />
        ) : (
          <Box
            borderWidth="1px"
            borderColor="border"
            borderLeftWidth="4px"
            borderLeftColor="f1.500"
            bg="card"
            backgroundImage="repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 8px)"
            px={{ base: 4, md: 7 }}
            py={{ base: 5, md: 7 }}
          >
            <Text
              fontFamily="mono"
              fontSize="10px"
              color="fg.muted"
              letterSpacing="0.14em"
              textTransform="uppercase"
            >
              Live Timing
            </Text>
            <Heading mt="2" size={{ base: "lg", md: "2xl" }}>
              Nenhuma sessao programada
            </Heading>
            <Text mt="2" color="fg.muted">
              A proxima sessao ainda nao esta disponivel.
            </Text>
          </Box>
        )}
      </Box>
    </Flex>
  );
}
