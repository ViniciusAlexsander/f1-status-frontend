import type { WeatherDataPayload } from "@/api/types/livetiming";
import { Badge, Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { RiFlagLine, RiRadioLine } from "react-icons/ri";
import { TrackStatusDisplay } from "./TrackStatusDisplay";
import { WeatherStrip } from "./WeatherStrip";
import type { LiveSession } from "../types";

type LiveTimingHeaderProps = {
  sessionName: string;
  sessionTypeLabel: string;
  session?: LiveSession;
  hasLiveData: boolean;
  trackStatus?: string;
  weather?: WeatherDataPayload;
  unreadMessages: number;
  onOpenRaceControl: () => void;
};

export function LiveTimingHeader({
  sessionName,
  sessionTypeLabel,
  session,
  hasLiveData,
  trackStatus,
  weather,
  unreadMessages,
  onOpenRaceControl,
}: LiveTimingHeaderProps) {
  return (
    <Box
      borderWidth="1px"
      borderColor="border"
      borderRadius="lg"
      bg="card"
      p={{ base: 2.5, md: 6 }}
    >
      <Flex
        align={{ base: "flex-start", md: "center" }}
        justify="space-between"
        gap={{ base: 2, md: 4 }}
        wrap="wrap"
      >
        <Box minW="0">
          <Text
            fontFamily="mono"
            fontSize="10px"
            color="fg.muted"
            letterSpacing="0.12em"
            textTransform="uppercase"
          >
            {sessionTypeLabel}
          </Text>
          <Heading mt="1" size={{ base: "lg", md: "xl" }} truncate>
            {sessionName}
          </Heading>
        </Box>
        <Button
          variant="outline"
          onClick={onOpenRaceControl}
          flexShrink="0"
          px={{ base: 2, md: 4 }}
          aria-label={`Race Control: ${unreadMessages} notificações não lidas. Ver histórico`}
        >
          <RiRadioLine />
          <Text display={{ base: "none", md: "inline" }}>Race Control</Text>
          {unreadMessages > 0 && (
            <Badge colorPalette="red" borderRadius="full">
              {unreadMessages}
            </Badge>
          )}
        </Button>
      </Flex>

      <Flex
        mt={{ base: 2, md: 5 }}
        direction={{ base: "column", xl: "row" }}
        justify="space-between"
        align={{ base: "stretch", xl: "center" }}
        gap={{ base: 2, xl: 5 }}
      >
        <Flex
          align="center"
          gap={{ base: 1, md: 2 }}
          wrap="wrap"
          flexShrink="0"
        >
          <Badge
            colorPalette={hasLiveData ? "red" : "gray"}
            variant="subtle"
            px={{ base: 2, md: 3 }}
            py={{ base: 1, md: 1.5 }}
            borderRadius="full"
            fontSize={{ base: "9px", md: "xs" }}
          >
            <RiRadioLine /> {hasLiveData ? "AO VIVO" : "AGUARDANDO SINAL"}
          </Badge>
          {(trackStatus ?? session?.trackStatus) && (
            <Box
              borderWidth="1px"
              borderColor="border"
              borderRadius="full"
              px={{ base: 2, md: 3 }}
              py={{ base: 1, md: 1.5 }}
              fontSize={{ base: "10px", md: "xs" }}
            >
              <TrackStatusDisplay
                status={trackStatus ?? session?.trackStatus ?? ""}
              />
            </Box>
          )}
          {session?.qualifyingPart != null &&
            session.qualifyingPart >= 1 &&
            session.qualifyingPart <= 3 && (
              <Badge
                colorPalette="purple"
                variant="subtle"
                px={{ base: 2, md: 3 }}
                py={{ base: 1, md: 1.5 }}
                borderRadius="full"
                fontSize={{ base: "9px", md: "xs" }}
              >
                Q{session.qualifyingPart}
                {session.qualifyingPartFinishedAt ? " · Encerrado" : ""}
              </Badge>
            )}
          {session && (
            <Badge
              colorPalette="gray"
              variant="subtle"
              px={{ base: 2, md: 3 }}
              py={{ base: 1, md: 1.5 }}
              borderRadius="full"
              fontSize={{ base: "9px", md: "xs" }}
            >
              <RiFlagLine /> VOLTA {session.lap}
            </Badge>
          )}
        </Flex>

        <Box
          borderTopWidth={{ base: "1px", xl: "0" }}
          borderColor="border"
          pt={{ base: 2, xl: 0 }}
          maxW={{ base: "full", xl: "720px" }}
          ml={{ xl: "auto" }}
        >
          <Text
            mb={{ base: 1.5, md: 3, xl: 1.5 }}
            fontFamily="mono"
            fontSize="9px"
            color="fg.muted"
            letterSpacing="0.12em"
            textTransform="uppercase"
          >
            Condições da pista
          </Text>
          {weather ? (
            <WeatherStrip weather={weather} />
          ) : (
            <Text color="fg.muted" fontSize="sm">
              Aguardando dados do clima.
            </Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
}
