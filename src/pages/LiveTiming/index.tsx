import { RaceControlPanel } from "./components/RaceControlPanel";
import { LiveTimingHeader } from "./components/LiveTimingHeader";
import { LiveTimingLeaderboard } from "./components/LiveTimingLeaderboard";
import { useDriversLiveTimingData } from "@/hooks/useDriversLiveTimingData";
import { useLiveTimingUpdates } from "@/hooks/useLiveTimingUpdates";
import { useSessionLiveTimingData } from "@/hooks/useSessionLiveTimingData";
import { useListRaces } from "@/hooks/useListRaces";
import type { DriverPenalty } from "@/api/types/livetiming";
import { Box, Stack } from "@chakra-ui/react";
import { useMemo } from "react";
import { useLiveTimingPageState } from "./hooks/useLiveTimingPageState";
import { useRaceControlNotifications } from "./hooks/useRaceControlNotifications";

export default function LiveTiming() {
  const { drivers } = useDriversLiveTimingData();
  const { session } = useSessionLiveTimingData();
  const { trackStatus, weather, messages, penalties, newMessageBatch } =
    useLiveTimingUpdates();
  const { data: raceData } = useListRaces();
  const { sessionName, sessionTypeLabel } = useLiveTimingPageState(
    raceData,
    session,
  );
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
        <LiveTimingLeaderboard
          drivers={drivers}
          penaltiesByDriver={penaltiesByDriver}
        />
        <Box ref={historyRef}>
          <RaceControlPanel messages={messages} />
        </Box>
      </Stack>
    </Box>
  );
}
