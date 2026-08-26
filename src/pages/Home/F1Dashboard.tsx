import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { RiArrowRightLine, RiCalendarLine, RiRadioLine } from "react-icons/ri";
import type { RaceListData, RaceWeek, Schedule } from "@/api/types/race";
import { useListRaces } from "@/hooks/useListRaces";
import {
  formatDateCompact,
  formatDateTime,
  formatDateWithoutTime,
} from "@/utils/date";
import { SiteHeader } from "@/components/dashboard/SiteHeader";
import { ViewTabs, type ViewTab } from "@/components/dashboard/ViewTabs";

const tabs: ViewTab[] = [
  { id: "next", label: "Próxima" },
  { id: "calendar", label: "Calendário" },
  { id: "results", label: "Resultados" },
];

function Panel({
  visible,
  children,
}: {
  visible: boolean;
  children: React.ReactNode;
}) {
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

function PanelFrame({
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

function SectionTitle({
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
  const target = useMemo(
    () => new Date(`${race.dateStart}T00:00:00`).getTime(),
    [race.dateStart],
  );
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, target - Date.now()),
  );

  useEffect(() => {
    const update = () => setRemaining(Math.max(0, target - Date.now()));
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const parts = [
    [Math.floor(remaining / 86_400_000), "dias"],
    [Math.floor(remaining / 3_600_000) % 24, "hrs"],
    [Math.floor(remaining / 60_000) % 60, "min"],
    [Math.floor(remaining / 1000) % 60, "seg"],
  ] as const;

  return (
    <Flex gap={{ base: 3, md: 5 }} align="end" wrap="wrap">
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

function SessionRow({ session }: { session: Schedule }) {
  return (
    <Flex
      align="center"
      justify="space-between"
      gap="3"
      borderTopWidth="1px"
      borderColor="border"
      px="5"
      py="2.5"
    >
      <Text
        fontSize="sm"
        color={session.type === "race" ? "fg" : "fg.muted"}
        fontWeight={session.type === "race" ? "600" : "400"}
      >
        {session.name}
      </Text>
      <Text fontFamily="mono" fontSize="xs" color="fg.muted">
        {formatDateTime(session.startTime)}
      </Text>
    </Flex>
  );
}

function NextRacePanel({
  race,
  compact = false,
}: {
  race: RaceWeek;
  compact?: boolean;
}) {
  return (
    <PanelFrame id="proxima">
      <Box
        borderLeftWidth="4px"
        borderColor="f1.500"
        p={compact ? 4 : { base: 5, md: 7 }}
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
                Próxima etapa
              </Text>
              <Badge colorPalette="f1" variant="outline">
                {race.status}
              </Badge>
            </Flex>
            <Heading
              fontSize={compact ? "2xl" : { base: "2xl", md: "5xl" }}
              lineHeight="1.05"
              fontWeight="600"
              wordBreak="normal"
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
                <SessionRow key={session.id} session={session} />
              ))}
            </Stack>
          </Box>
        </Flex>
      </Box>
    </PanelFrame>
  );
}

function CalendarPanel({ races }: { races: RaceWeek[] }) {
  return (
    <PanelFrame id="calendario">
      <SectionTitle detail={`${races.length} etapas`}>
        <RiCalendarLine /> Calendário 2026
      </SectionTitle>
      <Box w="full" maxW="full" overflowX="auto" overscrollBehaviorX="contain">
        <Flex gap="1px" minW="max-content" bg="border">
          {races.map((race, index) => (
            <Box
              key={race.id}
              w={{ base: "9.5rem", md: "10.5rem" }}
              flexShrink="0"
              bg="card"
              p={{ base: 3, md: 4 }}
              borderTopWidth={race.status === "ongoing" ? "3px" : 0}
              borderColor="f1.500"
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
              <Text
                mt="3"
                fontFamily="mono"
                fontSize="10px"
                letterSpacing="0.1em"
                color={race.status === "ongoing" ? "f1.500" : "fg.muted"}
                textTransform="uppercase"
              >
                {race.status}
              </Text>
            </Box>
          ))}
        </Flex>
      </Box>
    </PanelFrame>
  );
}

function ResultsPanel({ races }: { races: RaceWeek[] }) {
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
            <Flex
              key={race.id}
              align={{ md: "center" }}
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              gap="3"
              px={{ base: 4, md: 5 }}
              py="3.5"
            >
              <Box w="full">
                <Text
                  fontFamily="mono"
                  fontSize="10px"
                  letterSpacing="0.12em"
                  color="fg.muted"
                  textTransform="uppercase"
                >
                  {formatDateWithoutTime(race.dateStart)}
                </Text>
                <Text mt="1" fontSize="sm" fontWeight="500">
                  {race.name}
                </Text>
              </Box>
              <Badge colorPalette="gray" variant="outline">
                {race.status}
              </Badge>
            </Flex>
          ))
        )}
      </Stack>
    </PanelFrame>
  );
}

function LivePanel({ race }: { race: RaceWeek }) {
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

export default function F1Dashboard() {
  const { data, isLoading, isError, error } = useListRaces();
  const [view, setView] = useState("next");
  const [liveMode, setLiveMode] = useState(false);
  const raceData = data as RaceListData | undefined;
  const finished =
    raceData?.races.filter((race) => race.status === "completed") ?? [];

  if (isLoading)
    return (
      <Container maxW="1600px" py="12">
        <Stack align="center">
          <Spinner size="lg" />
          <Text color="fg.muted">Carregando calendário...</Text>
        </Stack>
      </Container>
    );
  if (isError || !raceData)
    return (
      <Container maxW="1600px" py="12">
        <Text color="f1.500">
          {error?.message ?? "Não foi possível carregar os dados."}
        </Text>
      </Container>
    );

  const activeRace = raceData.currentRace ?? raceData.nextRace;
  const statusLabel = liveMode
    ? "Corrida em andamento"
    : raceData.nextRace
      ? `Largada em ${formatDateWithoutTime(raceData.nextRace.dateStart)}`
      : "Temporada";

  return (
    <Box minH="100dvh">
      <SiteHeader
        isLive={liveMode}
        statusLabel={statusLabel}
        compactStatusLabel={
          liveMode
            ? "Sessão ao vivo"
            : raceData.nextRace
              ? `Largada em ${formatDateCompact(raceData.nextRace.dateStart)}`
              : "Temporada"
        }
        onToggleLive={() => setLiveMode((value) => !value)}
      />
      <Container maxW="1600px" px={{ base: 4, md: 6 }} pb="10">
        <ViewTabs tabs={tabs} value={view} onChange={setView} />
        <Grid
          templateColumns={{ base: "1fr", xl: "minmax(0, 1fr) 20rem" }}
          gap="4"
          pt={{ base: 4, md: 6 }}
        >
          <Stack gap="4" minW="0">
            <Panel visible={view === "next"}>
              {activeRace && <NextRacePanel race={activeRace} />}
            </Panel>
            <Panel visible={view === "calendar"}>
              <CalendarPanel races={raceData.races} />
            </Panel>
            <Panel visible={view === "results"}>
              <ResultsPanel races={finished} />
            </Panel>
          </Stack>
          <Stack gap="4" minW="0">
            <Panel visible={view === "next"}>
              {liveMode && activeRace ? (
                <LivePanel race={activeRace} />
              ) : (
                <ResultsPanel races={finished.slice(0, 5)} />
              )}
            </Panel>
            <Panel visible={view === "calendar"}>
              {raceData.nextRace && (
                <NextRacePanel race={raceData.nextRace} compact />
              )}
            </Panel>
            <Panel visible={view === "results"}>
              {raceData.nextRace && (
                <NextRacePanel race={raceData.nextRace} compact />
              )}
            </Panel>
          </Stack>
        </Grid>
      </Container>
    </Box>
  );
}
