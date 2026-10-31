import type { RaceListData, RaceWeek, Schedule } from "@/api/types/race";
import { useEffect, useMemo, useState } from "react";
import type { LiveSession } from "../types";

const FINISHED_SESSION_GRACE_PERIOD_MS = 20 * 60 * 1000;

export function useLiveTimingPageState(
  raceData: RaceListData | undefined,
  session: LiveSession | undefined,
) {
  const [now, setNow] = useState(() => Date.now());
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
    (race): race is RaceWeek =>
      Boolean(
        race?.schedule.some(
          (scheduled) => scheduled.id === nextScheduledSession?.id,
        ),
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
  const showNextSessionBanner =
    isWaitingForNextSession &&
    Boolean(raceData) &&
    !isWithinFinishedSessionGracePeriod;

  useEffect(() => {
    const shouldUpdateCountdown =
      isWaitingForNextSession &&
      (Boolean(nextScheduledSession) || isWithinFinishedSessionGracePeriod);
    if (!shouldUpdateCountdown) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [
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
    if (!isWaitingForNextSession || !nextScheduledSession) return;

    const sessionStartAt = Date.parse(nextScheduledSession.startTime);
    if (!Number.isFinite(sessionStartAt)) return;

    const reloadTimeout = window.setTimeout(
      () => window.location.reload(),
      Math.max(0, sessionStartAt - Date.now()),
    );
    return () => window.clearTimeout(reloadTimeout);
  }, [isWaitingForNextSession, nextScheduledSession]);

  return {
    sessionName: raceData?.currentRace?.name ?? "Sessão atual",
    sessionTypeLabel,
    nextScheduledSession,
    nextSessionRace,
    showNextSessionBanner,
  };
}

function getSessionTypeLabel(type: Schedule["type"]): string {
  const labels: Record<Schedule["type"], string> = {
    practice: "Treino livre",
    qualifying: "Classificação",
    race: "Corrida",
    sprint: "Sprint",
    sprint_qualifying: "Classificação Sprint",
  };
  return labels[type];
}
