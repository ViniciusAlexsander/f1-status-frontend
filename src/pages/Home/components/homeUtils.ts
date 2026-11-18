import type { RaceWeek } from "@/api/types/race";

export function getFocusedSession(race: RaceWeek) {
  return (
    race.schedule.find((session) => session.status === "ongoing") ??
    race.schedule
      .filter((session) => session.status === "scheduled")
      .sort(
        (first, second) =>
          new Date(first.startTime).getTime() -
          new Date(second.startTime).getTime(),
      )[0]
  );
}

export function getNextScheduledSession(race: RaceWeek, now = Date.now()) {
  return race.schedule
    .filter(
      (session) =>
        session.status === "scheduled" && Date.parse(session.startTime) > now,
    )
    .sort(
      (first, second) =>
        Date.parse(first.startTime) - Date.parse(second.startTime),
    )[0];
}
