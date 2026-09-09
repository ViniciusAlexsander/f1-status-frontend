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
