import {
  DriverIndicators,
  FastestLapClock,
} from "./components/DriverIndicators";
import { PitStopsDisplay } from "./components/PitStopsDisplay";
import { RaceControlPanel } from "./components/RaceControlPanel";
import { TeamLogo } from "./components/TeamLogo";
import { TrackStatusDisplay } from "./components/TrackStatusDisplay";
import { TyreStintDisplay } from "./components/TyreStintDisplay";
import { WeatherStrip } from "./components/WeatherStrip";
import { useDriversLiveTimingData } from "@/hooks/useDriversLiveTimingData";
import { useLiveTimingUpdates } from "@/hooks/useLiveTimingUpdates";
import { useSessionLiveTimingData } from "@/hooks/useSessionLiveTimingData";
import { useListRaces } from "@/hooks/useListRaces";
import { NextRacePanel } from "@/pages/Home/components/HomePanels";
import {
  formatRemainingTime,
  getQualifyingRemainingSeconds,
} from "@/api/liveTimingFeatures";
import type { DriverPenalty } from "@/api/types/livetiming";
import type { ScheduleType } from "@/api/types/race";
import { toaster } from "@/components/ui/toaster";
import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiFlagLine,
  RiRadioLine,
  RiTimeLine,
} from "react-icons/ri";

const leaderboardColumns = {
  base: "24px minmax(100px, 1.2fr) minmax(48px, 0.75fr) minmax(44px, 0.7fr) minmax(58px, 0.9fr) minmax(32px, 0.55fr) minmax(58px, 0.9fr) minmax(58px, 0.9fr) minmax(36px, 0.6fr)",
  md: "36px minmax(140px, 1.3fr) repeat(2, minmax(64px, 0.8fr)) minmax(70px, 1fr) 56px minmax(90px, 1.1fr) minmax(92px, 1.15fr) minmax(78px, 1fr)",
  xl: "44px minmax(180px, 1.5fr) repeat(2, minmax(80px, 0.8fr)) minmax(90px, 1fr) 64px minmax(110px, 1fr) repeat(2, minmax(90px, 1fr))",
};
const FINISHED_SESSION_GRACE_PERIOD_MS = 20 * 60 * 1000;

export default function LiveTiming() {
  const { drivers } = useDriversLiveTimingData();
  const { session } = useSessionLiveTimingData();
  const { trackStatus, weather, clock, messages, penalties, newMessageBatch } =
    useLiveTimingUpdates();
  const { data: raceData } = useListRaces();
  const [now, setNow] = useState(() => Date.now());
  const hasClock = clock != null;
  const hasLiveData = drivers.length > 0;
  const sessionName = raceData?.currentRace?.name ?? "Sessão atual";
  const activeSchedule = raceData?.currentRace?.schedule.find(
    (item) => item.status === "ongoing",
  );
  const latestCompletedSchedule = useMemo(
    () =>
      raceData?.currentRace?.schedule
        .filter((item) => item.status === "completed")
        .sort(
          (first, second) =>
            Date.parse(second.endTime) - Date.parse(first.endTime),
        )[0],
    [raceData?.currentRace?.schedule],
  );
  const nextScheduledSession = useMemo(() => {
    const schedules = [
      ...(raceData?.currentRace?.schedule ?? []),
      ...(raceData?.nextRace?.schedule ?? []),
    ];
    return schedules
      .filter(
        (item) =>
          item.status === "scheduled" && Date.parse(item.startTime) > now,
      )
      .sort(
        (first, second) =>
          Date.parse(first.startTime) - Date.parse(second.startTime),
      )[0];
  }, [raceData, now]);
  const nextSessionRace = [raceData?.currentRace, raceData?.nextRace].find(
    (race) =>
      race?.schedule.some(
        (scheduled) => scheduled.id === nextScheduledSession?.id,
      ),
  );
  const sessionTypeLabel =
    session?.sessionTypeLabel ??
    (activeSchedule
      ? getSessionTypeLabel(activeSchedule.type)
      : session?.qualifyingPart
        ? "Classificação"
        : "Live Timing");
  const isWaitingForNextSession =
    Boolean(raceData) &&
    (!activeSchedule || session?.sessionStatus === "Finished");
  const isSessionOver =
    session?.sessionStatus === "Finished" ||
    (!activeSchedule && latestCompletedSchedule != null);
  const finishedSchedule = activeSchedule ?? latestCompletedSchedule;
  const sessionFinishedAt = Date.parse(
    session?.qualifyingPartFinishedAt ?? finishedSchedule?.endTime ?? "",
  );
  const isWithinFinishedSessionGracePeriod =
    isSessionOver &&
    Number.isFinite(sessionFinishedAt) &&
    now < sessionFinishedAt + FINISHED_SESSION_GRACE_PERIOD_MS;
  const finishedSessionGraceEndsAt =
    isSessionOver && Number.isFinite(sessionFinishedAt)
      ? sessionFinishedAt + FINISHED_SESSION_GRACE_PERIOD_MS
      : undefined;
  const [unreadMessages, setUnreadMessages] = useState(0);
  const historyRef = useRef<HTMLDivElement>(null);
  const notifiedMessageIdsRef = useRef(new Set<string>());
  const sessionStartReloadTimeoutRef = useRef<number | null>(null);

  const penaltiesByDriver = useMemo(() => {
    const result = new Map<string, DriverPenalty[]>();
    for (const penalty of penalties) {
      const current = result.get(penalty.racingNumber) ?? [];
      current.push(penalty);
      result.set(penalty.racingNumber, current);
    }
    return result;
  }, [penalties]);

  useEffect(() => {
    const freshMessages = newMessageBatch.filter((message) => {
      const id = `${message.Utc ?? ""}|${message.Message ?? JSON.stringify(message)}`;
      if (notifiedMessageIdsRef.current.has(id)) return false;
      notifiedMessageIdsRef.current.add(id);
      return true;
    });
    if (!freshMessages.length) return;
    setUnreadMessages((count) => count + freshMessages.length);
    const latest = freshMessages.at(-1);
    toaster.create({
      title:
        freshMessages.length === 1
          ? "Nova mensagem do Race Control"
          : `${freshMessages.length} novas mensagens do Race Control`,
      description:
        latest?.Message ?? "A direção de prova publicou uma atualização.",
      type: "info",
      duration: 6500,
    });
  }, [newMessageBatch]);

  useEffect(() => {
    const node = historyRef.current;
    if (!node || unreadMessages === 0) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setUnreadMessages(0);
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [unreadMessages]);

  useEffect(() => {
    const hasActiveQualifyingTimer = Boolean(
      session?.qualifyingPartStartedAt &&
      session.qualifyingPart &&
      !session.qualifyingPartFinishedAt &&
      session.sessionStatus !== "Finished",
    );
    const hasActivePracticeTimer = Boolean(
      activeSchedule?.type === "practice" && hasClock,
    );
    const shouldUpdateCountdown =
      isWaitingForNextSession &&
      (Boolean(nextScheduledSession) || isWithinFinishedSessionGracePeriod);
    if (
      !hasActiveQualifyingTimer &&
      !hasActivePracticeTimer &&
      !shouldUpdateCountdown
    ) {
      return;
    }
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [
    session?.qualifyingPart,
    session?.qualifyingPartStartedAt,
    session?.qualifyingPartFinishedAt,
    session?.sessionStatus,
    activeSchedule?.type,
    hasClock,
    nextScheduledSession,
    isWaitingForNextSession,
    isWithinFinishedSessionGracePeriod,
  ]);

  useEffect(() => {
    if (
      !isWaitingForNextSession ||
      finishedSessionGraceEndsAt == null ||
      finishedSessionGraceEndsAt <= Date.now()
    ) {
      return;
    }

    const reloadTimeout = window.setTimeout(
      () => window.location.reload(),
      finishedSessionGraceEndsAt - Date.now(),
    );
    return () => window.clearTimeout(reloadTimeout);
  }, [finishedSessionGraceEndsAt, isWaitingForNextSession]);

  useEffect(() => {
    if (
      !isWaitingForNextSession ||
      !nextScheduledSession ||
      sessionStartReloadTimeoutRef.current !== null
    ) {
      return;
    }

    const sessionStartAt = Date.parse(nextScheduledSession.startTime);
    if (!Number.isFinite(sessionStartAt)) return;

    sessionStartReloadTimeoutRef.current = window.setTimeout(
      () => window.location.reload(),
      Math.max(0, sessionStartAt - Date.now()),
    );
  }, [isWaitingForNextSession, nextScheduledSession]);

  useEffect(
    () => () => {
      if (sessionStartReloadTimeoutRef.current !== null) {
        window.clearTimeout(sessionStartReloadTimeoutRef.current);
        sessionStartReloadTimeoutRef.current = null;
      }
    },
    [],
  );

  const qualifyingRemaining = session?.qualifyingPart
    ? getQualifyingRemainingSeconds(
        session.qualifyingPart,
        session.qualifyingPartStartedAt,
        session.qualifyingPartFinishedAt ? "Finished" : session.sessionStatus,
        session.qualifyingRedFlagIntervals,
        now,
      )
    : undefined;
  const practiceRemaining =
    activeSchedule?.type === "practice" && clock
      ? Math.max(
          0,
          clock.remainingSeconds - Math.floor((now - clock.receivedAt) / 1000),
        )
      : undefined;
  const showNextSessionBanner =
    isWaitingForNextSession &&
    Boolean(raceData) &&
    !isWithinFinishedSessionGracePeriod;

  const openHistory = () => {
    historyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setUnreadMessages(0);
  };

  if (showNextSessionBanner && raceData) {
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

  return (
    <Box w="full" minH="calc(100dvh - 72px)" overflowX="clip">
      <Stack
        w="full"
        maxW="1800px"
        mx="auto"
        gap={{ base: 2, md: 7 }}
        px={{ base: 1.5, sm: 4, lg: 7, "2xl": 10 }}
        py={{ base: 1, md: 7 }}
      >
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
              onClick={openHistory}
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
                    <RiTimeLine /> Q{session.qualifyingPart}
                    {qualifyingRemaining != null
                      ? ` · ${formatRemainingTime(qualifyingRemaining)}`
                      : session.qualifyingPartFinishedAt
                        ? " · Encerrado"
                        : ""}
                  </Badge>
                )}
              {practiceRemaining != null && (
                <Badge
                  colorPalette="cyan"
                  variant="subtle"
                  px={{ base: 2, md: 3 }}
                  py={{ base: 1, md: 1.5 }}
                  borderRadius="full"
                  fontSize={{ base: "9px", md: "xs" }}
                  aria-label="Tempo restante do treino"
                >
                  <RiTimeLine /> {formatRemainingTime(practiceRemaining)}
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

        <Box>
          {hasLiveData ? (
            <Box
              w="full"
              overflowX="auto"
              borderWidth="1px"
              borderColor="border"
              borderRadius="lg"
              overscrollBehaviorX="contain"
              css={{
                scrollbarColor: "var(--chakra-colors-border) transparent",
              }}
            >
              <Box
                minW={{ base: "500px", md: "750px", xl: "0" }}
                w={{
                  base: "max(100%, 500px)",
                  md: "max(100%, 750px)",
                  xl: "full",
                }}
              >
                <Grid
                  templateColumns={leaderboardColumns}
                  gap={{ base: 0.5, md: 1, xl: 2 }}
                  alignItems="center"
                  position="sticky"
                  top="0"
                  zIndex="2"
                  bg="bg.subtle"
                  borderBottomWidth="1px"
                  borderColor="border"
                  px={{ base: 1, md: 3 }}
                  py={{ base: 1.5, md: 3 }}
                  fontFamily="mono"
                  fontSize="9px"
                  color="fg.muted"
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                >
                  <Text>Pos</Text>
                  <Text>Piloto</Text>
                  <Text textAlign="right">Gap</Text>
                  <Text textAlign="right">
                    <Text as="span" display={{ base: "none", xl: "inline" }}>
                      Intervalo
                    </Text>
                    <Text as="span" display={{ base: "inline", xl: "none" }}>
                      Int
                    </Text>
                  </Text>
                  <Text textAlign="right">
                    <Text as="span" display={{ base: "none", xl: "inline" }}>
                      Última
                    </Text>
                    <Text as="span" display={{ base: "inline", xl: "none" }}>
                      Últ.
                    </Text>
                  </Text>
                  <Text textAlign="center">Pits</Text>
                  <Text textAlign="center">Pneu/Stint</Text>
                  <Text textAlign="right">Melhor</Text>
                  <Text textAlign="center">Laps</Text>
                </Grid>
                {drivers.map((driver, index) => (
                  <Grid
                    key={driver.id}
                    templateColumns={leaderboardColumns}
                    gap={{ base: 0.5, md: 1, xl: 2 }}
                    alignItems="center"
                    minH={{ base: "42px", md: "56px" }}
                    px={{ base: 1, md: 3 }}
                    py={{ base: 1, md: 2 }}
                    bg={index % 2 === 0 ? "card" : "bg.subtle"}
                    borderBottomWidth="1px"
                    borderColor="border"
                    fontVariantNumeric="tabular-nums"
                  >
                    <Text fontFamily="mono" fontSize="sm" fontWeight="700">
                      {driver.Position ?? driver.RacingNumber ?? "—"}
                    </Text>
                    <Flex minW="0" align="center" gap={{ base: 1.5, md: 2 }}>
                      {driver.driverData && (
                        <TeamLogo
                          teamName={driver.driverData.teams[0]?.shortName}
                        />
                      )}
                      <Badge
                        flexShrink="0"
                        bg={driver.driverData?.teams[0]?.color}
                        color={driver.driverData?.teams[0]?.textColor}
                        minW={{ base: "7", md: "9" }}
                        px={{ base: 1, md: 2 }}
                        fontSize={{ base: "10px", md: "xs" }}
                      >
                        {driver.driverData?.code ?? driver.RacingNumber}
                      </Badge>
                      <Text
                        display={{ base: "none", lg: "block" }}
                        minW="0"
                        truncate
                        fontSize="xs"
                        fontWeight="600"
                      >
                        {driver.driverData
                          ? `${driver.driverData.firstName} ${driver.driverData.lastName}`
                          : "Piloto sem cadastro"}
                      </Text>
                      <PositionChange value={driver.positionChange} />
                      {driver.isFastestLap && (
                        <Box
                          display={{ base: "flex", lg: "none" }}
                          flexShrink="0"
                          alignItems="center"
                        >
                          <FastestLapClock driver={driver} size={16} />
                        </Box>
                      )}
                      <DriverIndicators
                        driver={driver}
                        penalties={
                          driver.RacingNumber
                            ? (penaltiesByDriver.get(driver.RacingNumber) ?? [])
                            : []
                        }
                      />
                    </Flex>
                    <Box minW="0">
                      <Cell align="right">
                        {driver.GapToLeader ?? (index === 0 ? "LÍDER" : "—")}
                      </Cell>
                    </Box>
                    <Cell align="right">
                      {driver.IntervalToPositionAhead?.Value ??
                        driver.TimeDiffToPositionAhead ??
                        "—"}
                    </Cell>
                    <Cell
                      align="right"
                      color={
                        driver.LastLapTime?.PersonalFastest
                          ? "personalBest"
                          : "fg"
                      }
                    >
                      {driver.LastLapTime?.Value ?? "—"}
                    </Cell>
                    <Cell align="center">
                      <PitStopsDisplay driver={driver} />
                    </Cell>
                    <Cell align="center">
                      <TyreStintDisplay driver={driver} />
                    </Cell>
                    <Cell
                      align="right"
                      color={driver.isFastestLap ? "fastest" : "fg"}
                    >
                      {driver.BestLapTime?.Value ?? "—"}
                    </Cell>
                    <Cell align="center">{driver.NumberOfLaps ?? "—"}</Cell>
                  </Grid>
                ))}
              </Box>
            </Box>
          ) : (
            <Box
              borderWidth="1px"
              borderColor="border"
              borderRadius="lg"
              bg="card"
              textAlign="center"
              px="5"
              py="14"
            >
              <Text fontFamily="mono" fontSize="sm" textTransform="uppercase">
                Nenhuma transmissão disponível
              </Text>
              <Text mt="2" fontSize="sm" color="fg.muted">
                O leaderboard será preenchido quando o servidor enviar dados ao
                vivo.
              </Text>
            </Box>
          )}
        </Box>

        <Box ref={historyRef}>
          <RaceControlPanel messages={messages} />
        </Box>
      </Stack>
    </Box>
  );
}

function Cell({
  children,
  align = "left",
  color = "fg.muted",
}: {
  children: ReactNode;
  align?: "left" | "right" | "center";
  color?: string;
}) {
  return (
    <Text
      minW="0"
      textAlign={align}
      color={color}
      fontFamily="mono"
      fontSize="xs"
      truncate
    >
      {children}
    </Text>
  );
}

function PositionChange({ value }: { value?: number }) {
  if (value == null || value === 0) return null;
  const gained = value > 0;
  const Icon = gained ? RiArrowUpSLine : RiArrowDownSLine;
  return (
    <Flex
      align="center"
      justify="center"
      gap="0.5"
      color={gained ? "green.400" : "red.400"}
      fontFamily="mono"
      fontSize="xs"
      fontWeight="700"
    >
      <Icon aria-hidden="true" />
      {Math.abs(value)}
    </Flex>
  );
}

function getSessionTypeLabel(type: ScheduleType): string {
  const labels: Record<ScheduleType, string> = {
    practice: "Treino livre",
    qualifying: "Classificação",
    race: "Corrida",
    sprint: "Sprint",
    sprint_qualifying: "Classificação Sprint",
  };
  return labels[type];
}
