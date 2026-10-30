import { useEffect, useRef, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { RiArrowRightLine, RiCalendarLine, RiRadioLine } from "react-icons/ri";
import type { RaceWeek, Schedule } from "@/api/types/race";
import { useSessionResults } from "@/hooks/useSessionResults";
import { formatDateTime, formatDateWithoutTime } from "@/utils/date";
import {
  getEventStatusPalette,
} from "@/utils/eventStatus";
import { getNextScheduledSession } from "./homeUtils";

type PanelProps = { children: React.ReactNode; visible: boolean };

export function Panel({ children, visible }: PanelProps) {
  return (
    <Box
      display={visible ? "block" : "none"}
      minW="0"
      xl={{ display: "block" }}
    >
      {children}
    </Box>
  );
}

export function PanelFrame({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <Box
      id={id}
      minW="0"
      overflow="hidden"
      borderWidth="1px"
      borderColor="border"
      bg="card"
    >
      {children}
    </Box>
  );
}

export function SectionTitle({
  children,
  detail,
}: {
  children: React.ReactNode;
  detail?: React.ReactNode;
}) {
  return (
    <Flex
      align="baseline"
      justify="space-between"
      gap="4"
      borderBottomWidth="1px"
      borderColor="border"
      px={{ base: 4, md: 5 }}
      py="3"
    >
      <Heading
        display="flex"
        alignItems="center"
        gap="2"
        fontFamily="mono"
        fontSize="11px"
        letterSpacing="0.14em"
        textTransform="uppercase"
      >
        {children}
      </Heading>
      {detail && (
        <Text
          fontFamily="mono"
          fontSize="10px"
          letterSpacing="0.12em"
          color="fg.muted"
          textTransform="uppercase"
        >
          {detail}
        </Text>
      )}
    </Flex>
  );
}

function Countdown({ race }: { race: RaceWeek }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const nextSession = getNextScheduledSession(race, now);
  if (!nextSession) return null;
  const remaining = Math.max(0, Date.parse(nextSession.startTime) - now);

  const parts = [
    [Math.floor(remaining / 86_400_000), "dias"],
    [Math.floor(remaining / 3_600_000) % 24, "hrs"],
    [Math.floor(remaining / 60_000) % 60, "min"],
    [Math.floor(remaining / 1000) % 60, "seg"],
  ] as const;

  return (
    <Flex gap={{ base: 3, md: 5 }} align="end" wrap="wrap">
      <Text w="full" fontFamily="mono" fontSize="10px" color="fg.muted">
        Proxima sessao: {nextSession.name}
      </Text>
      {parts.map(([value, label]) => (
        <Box key={label} textAlign="center">
          <Text
            fontFamily="mono"
            fontSize={{ base: "2xl", md: "4xl" }}
            lineHeight="1"
            fontWeight="500"
            fontVariantNumeric="tabular-nums"
          >
            {String(value).padStart(2, "0")}
          </Text>
          <Text
            mt="1.5"
            fontFamily="mono"
            fontSize="10px"
            letterSpacing="0.12em"
            color="fg.muted"
            textTransform="uppercase"
          >
            {label}
          </Text>
        </Box>
      ))}
    </Flex>
  );
}

function SessionRow({
  session,
  isFocused,
}: {
  session: Schedule;
  isFocused: boolean;
}) {
  const statusLabel = session.statusLabel;
  const statusPalette = getEventStatusPalette(session.status);

  return (
    <Flex
      align="center"
      justify="space-between"
      gap="3"
      borderTopWidth="1px"
      borderColor="border"
      borderLeftWidth={isFocused ? "3px" : "0"}
      borderLeftColor={isFocused ? "f1.500" : "transparent"}
      bg={isFocused ? "bg.subtle" : "transparent"}
      px="3"
      py="2.5"
    >
      <Box minW="0">
        <Text
          fontSize="sm"
          color={session.type === "race" ? "fg" : "fg.muted"}
          fontWeight={session.type === "race" || isFocused ? "600" : "400"}
          truncate
        >
          {session.name}
        </Text>
        <Text mt="1" fontFamily="mono" fontSize="10px" color="fg.muted">
          {formatDateTime(session.startTime)}
        </Text>
      </Box>
      <Flex flexShrink="0" align="center" justify="end" gap="1" wrap="wrap">
        <Badge colorPalette={statusPalette} variant="subtle" fontSize="9px">
          {statusLabel}
        </Badge>
        {isFocused && (
          <Badge colorPalette="f1" fontSize="9px">
            {session.status === "ongoing" ? "Agora" : "Proxima"}
          </Badge>
        )}
      </Flex>
    </Flex>
  );
}

export function NextRacePanel({
  race,
  compact = false,
  focusedSession,
}: {
  race: RaceWeek;
  compact?: boolean;
  focusedSession?: Schedule;
}) {
  return (
    <PanelFrame id="proxima">
      <Box
        borderLeftWidth="4px"
        borderColor="f1.500"
        p={compact ? 4 : { base: 5, md: 7 }}
        backgroundImage="repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 8px)"
      >
        <Flex
          direction={compact ? "column" : { base: "column", md: "row" }}
          justify="space-between"
          gap={compact ? 5 : 8}
        >
          <Stack gap="4" minW="0">
            <Flex gap="3" align="center" wrap="wrap">
              <Text
                fontFamily="mono"
                fontSize="11px"
                letterSpacing="0.14em"
                color="fg.muted"
                textTransform="uppercase"
              >
                {race.status === "ongoing"
                  ? "Etapa em andamento"
                  : "Próxima etapa"}
              </Text>
              <Badge colorPalette={getEventStatusPalette(race.status)} variant="subtle">
                {race.statusLabel}
              </Badge>
              {focusedSession && (
                <Text
                  fontFamily="mono"
                  fontSize="10px"
                  color="fg.muted"
                  textTransform="uppercase"
                >
                  {focusedSession.status === "ongoing"
                    ? "Agora"
                    : "Próxima sessão"}
                  : {focusedSession.name}
                </Text>
              )}
            </Flex>
            <Heading
              fontSize={compact ? "2xl" : { base: "2xl", md: "5xl" }}
              lineHeight="1.05"
              fontWeight="600"
            >
              {race.name}
            </Heading>
            <Text fontFamily="mono" fontSize="sm" color="fg.muted">
              {race.location.name} · {race.location.city}
            </Text>
            <Text fontFamily="mono" fontSize="xs" color="fg.muted">
              {formatDateWithoutTime(race.dateStart)} a{" "}
              {formatDateWithoutTime(race.dateEnd)}
            </Text>
            <Button asChild size="sm" variant="outline" alignSelf="start">
              <RouterLink to={`/meetings/${race.id}`}>Ver detalhes</RouterLink>
            </Button>
            {focusedSession?.status === "ongoing" && (
              <Button
                asChild
                size="sm"
                colorPalette="f1"
                alignSelf="start"
              >
                <RouterLink to="/live">
                  <RiRadioLine /> Live Timing
                </RouterLink>
              </Button>
            )}
            <Countdown race={race} />
          </Stack>
          <Box
            minW={compact ? "0" : { md: "18rem" }}
            borderLeftWidth={compact ? 0 : { base: 0, md: "1px" }}
            borderTopWidth={compact ? "1px" : 0}
            borderColor="border"
            pl={compact ? 0 : { md: 6 }}
            pt={compact ? 4 : 0}
          >
            <Text
              mb="3"
              fontFamily="mono"
              fontSize="11px"
              letterSpacing="0.14em"
              color="fg.muted"
              textTransform="uppercase"
            >
              Programação
            </Text>
            <Stack gap="0">
              {race.schedule.map((session) => (
                <SessionRow
                  key={session.id}
                  session={session}
                  isFocused={focusedSession?.id === session.id}
                />
              ))}
            </Stack>
          </Box>
        </Flex>
      </Box>
    </PanelFrame>
  );
}

export function CalendarPanel({
  races,
  focusedRaceId,
}: {
  races: RaceWeek[];
  focusedRaceId?: string;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!focusedRaceId || !listRef.current) return;
    listRef.current
      .querySelector<HTMLElement>(`[data-race-id="${focusedRaceId}"]`)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
  }, [focusedRaceId]);

  return (
    <PanelFrame id="calendario">
      <SectionTitle detail={`${races.length} etapas`}>
        <RiCalendarLine /> Calendário 2026
      </SectionTitle>
      <Box
        ref={listRef}
        w="full"
        overflowX="auto"
        overscrollBehaviorX="contain"
      >
        <Flex gap="1px" minW="max-content" bg="border">
          {races.map((race, index) => (
            <Box
              key={race.id}
              data-race-id={race.id}
              w={{ base: "9.5rem", md: "10.5rem" }}
              flexShrink="0"
              bg="card"
              p={{ base: 3, md: 4 }}
              borderTopWidth={race.status === "ongoing" ? "3px" : 0}
              borderRightWidth="1px"
              borderColor="fg.muted"
            >
              <Text
                fontFamily="mono"
                fontSize="10px"
                letterSpacing="0.12em"
                color="fg.muted"
              >
                R{String(index + 1).padStart(2, "0")}
              </Text>
              <Text mt="3" fontFamily="mono" fontSize="xl" fontWeight="500">
                {race.location.country.twoCode ??
                  race.location.country.name.slice(0, 3).toUpperCase()}
              </Text>
              <Text mt="1.5" fontSize="sm">
                {race.location.city}
              </Text>
              <Text mt="3" fontFamily="mono" fontSize="10px" color="fg.muted">
                {formatDateWithoutTime(race.dateStart)}
              </Text>
              <Badge
                mt="3"
                colorPalette={getEventStatusPalette(race.status)}
                variant="subtle"
                fontSize="9px"
              >
                {race.statusLabel}
              </Badge>
              <Button asChild mt="3" size="xs" variant="outline" width="full">
                <RouterLink to={`/meetings/${race.id}`}>
                  Ver detalhes
                </RouterLink>
              </Button>
            </Box>
          ))}
        </Flex>
      </Box>
    </PanelFrame>
  );
}

export function ResultsPanel({ races }: { races: RaceWeek[] }) {
  return (
    <PanelFrame id="resultados">
      <SectionTitle detail={`${races.length} disputadas`}>
        Resultados anteriores
      </SectionTitle>
      <Stack gap="0" divideY="1px" divideColor="border">
        {races.length === 0 ? (
          <Text p="5" color="fg.muted">
            Nenhum resultado disponível.
          </Text>
        ) : (
          races.map((race) => (
            <Box key={race.id} px={{ base: 4, md: 5 }} py="3.5">
              <Flex align="flex-start" justify="space-between" gap="3">
                <Box minW="0">
                <Text
                  fontFamily="mono"
                  fontSize="10px"
                  letterSpacing="0.12em"
                  color="fg.muted"
                  textTransform="uppercase"
                >
                  {formatDateWithoutTime(race.dateStart)}
                </Text>
                <RouterLink to={`/meetings/${race.id}`}>
                  <Text
                    mt="1"
                    fontSize="sm"
                    fontWeight="500"
                    _hover={{ color: "f1.500" }}
                  >
                    {race.name}
                  </Text>
                </RouterLink>
                </Box>
                <Badge
                  flexShrink="0"
                  whiteSpace="nowrap"
                  colorPalette={getEventStatusPalette(race.status)}
                  variant="subtle"
                >
                  {race.statusLabel}
                </Badge>
              </Flex>
              <Button asChild mt="2" size="xs" variant="outline">
                <RouterLink to={`/meetings/${race.id}`}>
                  Ver detalhes
                </RouterLink>
              </Button>
            </Box>
          ))
        )}
      </Stack>
    </PanelFrame>
  );
}

export function LivePanel({ race }: { race: RaceWeek }) {
  return (
    <PanelFrame id="ao-vivo">
      <SectionTitle>
        <RiRadioLine /> Ao vivo
      </SectionTitle>
      <Stack gap="4" p="5">
        <Flex align="center" gap="2">
          <Box
            w="2.5"
            h="2.5"
            borderRadius="full"
            bg="f1.500"
            className="live-dot"
          />
          <Text fontFamily="mono" fontSize="sm" textTransform="uppercase">
            {race.name}
          </Text>
        </Flex>
        <Text color="fg.muted">
          A sessão em pista está disponível no live timing.
        </Text>
        <Button asChild colorPalette="f1" variant="outline" alignSelf="start">
          <RouterLink to="/live">
            Abrir live timing <RiArrowRightLine />
          </RouterLink>
        </Button>
      </Stack>
    </PanelFrame>
  );
}

export function LastRacePanel({ race }: { race: RaceWeek }) {
  const raceSession = race.schedule.find((session) => session.type === "race");
  const { data: results, isLoading } = useSessionResults(
    race.id,
    raceSession?.id,
    Boolean(raceSession),
  );
  const podium = results?.slice(0, 3) ?? [];

  return (
    <PanelFrame id="ultima-etapa">
      <Flex
        align="baseline"
        justify="space-between"
        borderBottomWidth="1px"
        borderColor="border"
        px="4"
        py="2.5"
      >
        <Heading
          fontFamily="mono"
          fontSize="11px"
          letterSpacing="0.14em"
          textTransform="uppercase"
        >
          Última etapa
        </Heading>
        <Badge
          colorPalette={getEventStatusPalette(race.status)}
          variant="subtle"
          fontSize="9px"
        >
          {race.statusLabel}
        </Badge>
      </Flex>
      <Text px="4" pt="3" fontSize="15px" fontWeight="500">
        {race.name}
      </Text>
      {isLoading ? (
        <Flex align="center" gap="2" px="4" py="4">
          <Spinner size="sm" />
          <Text fontSize="sm" color="fg.muted">
            Carregando resultado...
          </Text>
        </Flex>
      ) : podium.length > 0 ? (
        <Stack gap="0" mt="3" divideY="1px" divideColor="border">
          {podium.map((row, index) => (
            <Flex key={row.id} align="center" gap="3" px="4" py="2.5">
              <Text
                w="12"
                fontFamily="mono"
                fontSize="10px"
                color={index === 0 ? "fg" : "fg.muted"}
                textTransform="uppercase"
              >
                {index === 0 ? "Venceu" : `${index + 1}º`}
              </Text>
              <Box h={index === 0 ? "5" : "4"} w="3px" bg={row.team.color} />
              <Text
                flex="1"
                truncate
                fontSize="13px"
                fontWeight={index === 0 ? "500" : "400"}
              >
                {row.driver.firstName} {row.driver.lastName}
              </Text>
              <Text fontFamily="mono" fontSize="10px" color="fg.muted">
                {row.team.shortName}
              </Text>
            </Flex>
          ))}
        </Stack>
      ) : (
        <Text px="4" py="4" fontSize="sm" color="fg.muted">
          Resultado final ainda não disponível.
        </Text>
      )}
      <Button asChild size="xs" variant="outline" m="4" mt="3">
        <RouterLink to={`/meetings/${race.id}`}>Ver fim de semana</RouterLink>
      </Button>
    </PanelFrame>
  );
}
