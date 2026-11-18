import { RaceControlPanel } from "./components/RaceControlPanel";
import { LiveTimingHeader } from "./components/LiveTimingHeader";
import { LiveTimingLeaderboard } from "./components/LiveTimingLeaderboard";
import { TrackMap } from "./components/TrackMap";
import { UpcomingSessionBanner } from "./components/UpcomingSessionBanner";
import { useDriversLiveTimingData } from "@/hooks/useDriversLiveTimingData";
import { useLiveTimingUpdates } from "@/hooks/useLiveTimingUpdates";
import { useSessionLiveTimingData } from "@/hooks/useSessionLiveTimingData";
import { useListRaces } from "@/hooks/useListRaces";
import { useSessionResults } from "@/hooks/useSessionResults";
import type { DriverPenalty } from "@/api/types/livetiming";
import { PageIntro } from "@/components/content/PageIntro";
import { getSitePage } from "@/content/sitePages";
import { Box, Grid, Stack } from "@chakra-ui/react";
import { useMemo } from "react";
import { useLiveTimingPageState } from "./hooks/useLiveTimingPageState";
import { useRaceControlNotifications } from "./hooks/useRaceControlNotifications";

const liveIntro = getSitePage("/live");

export default function LiveTiming() {
  const { session } = useSessionLiveTimingData();
  const { trackStatus, weather, messages, penalties, newMessageBatch } =
    useLiveTimingUpdates();
  const { data: raceData } = useListRaces();
  const activeSchedule = raceData?.currentRace?.schedule.find(
    (item) => item.status === "ongoing",
  );
  const qualifyingSchedule = useMemo(() => {
    if (
      !activeSchedule ||
      (activeSchedule.type !== "race" && activeSchedule.type !== "sprint")
    ) {
      return undefined;
    }

    const expectedType =
      activeSchedule.type === "sprint" ? "sprint_qualifying" : "qualifying";
    const eligibleSessions = raceData?.currentRace?.schedule
      .filter(
        (item) =>
          item.type === expectedType &&
          item.status === "completed" &&
          Date.parse(item.endTime) <= Date.parse(activeSchedule.startTime),
      )
      .sort(
        (first, second) =>
          Date.parse(second.endTime) - Date.parse(first.endTime),
      );

    if (eligibleSessions?.[0]) return eligibleSessions[0];
    if (activeSchedule.type !== "sprint") return undefined;

    return raceData?.currentRace?.schedule
      .filter(
        (item) =>
          item.type === "qualifying" &&
          item.status === "completed" &&
          Date.parse(item.endTime) <= Date.parse(activeSchedule.startTime),
      )
      .sort(
        (first, second) =>
          Date.parse(second.endTime) - Date.parse(first.endTime),
      )[0];
  }, [activeSchedule, raceData?.currentRace?.schedule]);
  const { data: qualifyingResults } = useSessionResults(
    raceData?.currentRace?.id,
    qualifyingSchedule?.id,
  );
  const startingPositions = useMemo(() => {
    return new Map(
      (qualifyingResults ?? []).flatMap((result) => {
        const position = Number(result.position);
        const racingNumber = result.carNumber || String(result.driver.number);
        if (!Number.isInteger(position) || position < 1 || !racingNumber) {
          return [];
        }
        return [[racingNumber, position] as const];
      }),
    );
  }, [qualifyingResults]);
  const { drivers } = useDriversLiveTimingData(startingPositions);
  const {
    sessionName,
    sessionTypeLabel,
    nextScheduledSession,
    nextSessionRace,
    showNextSessionBanner,
  } = useLiveTimingPageState(raceData, session);
  const { unreadMessages, historyRef, openHistory } =
    useRaceControlNotifications(newMessageBatch);

  const penaltiesByDriver = useMemo(() => {
    const result = new Map<string, DriverPenalty[]>();
    for (const penalty of penalties) {
      const current = result.get(penalty.racingNumber) ?? [];
      current.push(penalty);
      result.set(penalty.racingNumber, current);
    }
    return result;
  }, [penalties]);

  if (showNextSessionBanner && raceData) {
    return (
      <Stack gap="4" px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }}>
        {liveIntro && <PageIntro page={liveIntro} />}
        <UpcomingSessionBanner
          nextScheduledSession={nextScheduledSession}
          nextSessionRace={nextSessionRace}
        />
      </Stack>
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
        {liveIntro && <PageIntro page={liveIntro} />}
        <LiveTimingHeader
          sessionName={sessionName}
          sessionTypeLabel={sessionTypeLabel}
          session={session}
          hasLiveData={drivers.length > 0}
          trackStatus={trackStatus}
          weather={weather}
          unreadMessages={unreadMessages}
          onOpenRaceControl={openHistory}
        />
        <Grid
          templateColumns={{
            base: "1fr",
            lg: "minmax(0, 1.35fr) minmax(0, 1fr) minmax(240px, 0.85fr)",
          }}
          gap={{ base: 2, md: 7 }}
          alignItems={{ base: "stretch", lg: "start" }}
        >
          <LiveTimingLeaderboard
            drivers={drivers}
            penaltiesByDriver={penaltiesByDriver}
          />
          <TrackMap
            location={
              raceData?.currentRace?.location ?? raceData?.nextRace?.location
            }
            fallbackName={
              sessionName !== "Sessão atual"
                ? sessionName
                : (raceData?.currentRace?.name ?? raceData?.nextRace?.name)
            }
          />
          <Box
            ref={historyRef}
            minH={{ lg: 0 }}
            h={{ lg: "full" }}
            overflow="hidden"
          >
            <RaceControlPanel messages={messages} />
          </Box>
        </Grid>
      </Stack>
    </Box>
  );
}
