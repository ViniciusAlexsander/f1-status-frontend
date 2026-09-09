import { useState } from "react";
import { Box, Container, Grid, Spinner, Stack, Text } from "@chakra-ui/react";
import type { RaceListData } from "@/api/types/race";
import { useListRaces } from "@/hooks/useListRaces";
import { formatDateCompact, formatDateWithoutTime } from "@/utils/date";
import { SiteHeader } from "@/components/dashboard/SiteHeader";
import { StandingsPanel } from "@/components/dashboard/StandingsPanel";
import {
  CalendarPanel,
  LivePanel,
  LastRacePanel,
  NextRacePanel,
  ResultsPanel,
} from "./components/HomePanels";
import { getFocusedSession } from "./components/homeUtils";

export default function F1Dashboard() {
  const { data, isLoading, isError, error } = useListRaces();
  const [liveMode, setLiveMode] = useState(false);
  const raceData = data as RaceListData | undefined;
  const finished =
    raceData?.races.filter((race) => race.status === "completed") ?? [];

  if (isLoading) {
    return (
      <Container maxW="1600px" py="12">
        <Stack align="center">
          <Spinner size="lg" />
          <Text color="fg.muted">Carregando calendário...</Text>
        </Stack>
      </Container>
    );
  }

  if (isError || !raceData) {
    return (
      <Container maxW="1600px" py="12">
        <Text color="f1.500">
          {error?.message ?? "Não foi possível carregar os dados."}
        </Text>
      </Container>
    );
  }

  const activeRace = raceData.currentRace ?? raceData.nextRace;
  const focusedSession = activeRace ? getFocusedSession(activeRace) : undefined;
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
        <Grid
          templateColumns={{ base: "1fr", xl: "minmax(0, 1fr) 20rem" }}
          gap="4"
          pt={{ base: 4, md: 6 }}
        >
          <Stack gap="4" minW="0">
            {activeRace && (
              <NextRacePanel
                race={activeRace}
                focusedSession={focusedSession}
              />
            )}

            <CalendarPanel
              races={raceData.races}
              focusedRaceId={activeRace?.id}
            />

            <ResultsPanel races={finished} />
          </Stack>
          <Stack gap="4" minW="0">
            <Stack gap="4">
              {liveMode && activeRace ? (
                <LivePanel race={activeRace} />
              ) : (
                <StandingsPanel compact />
              )}
              {!liveMode && finished[0] && (
                <LastRacePanel race={finished[finished.length - 1]} />
              )}
            </Stack>
          </Stack>
        </Grid>
      </Container>
    </Box>
  );
}
