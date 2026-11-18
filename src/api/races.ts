import { api } from "@/config/axios";
import type {
  ApiRaceWeek,
  ApiSchedule,
  RaceListData,
  RaceListResponse,
  RaceWeek,
  Schedule,
} from "./types/race";
import { getEventStatusLabel } from "@/utils/eventStatus";

function translateSchedule(schedule: ApiSchedule): Schedule {
  return {
    ...schedule,
    statusLabel: getEventStatusLabel(schedule.status),
  };
}

function translateRace(race: ApiRaceWeek): RaceWeek {
  return {
    ...race,
    statusLabel: getEventStatusLabel(race.status),
    schedule: race.schedule.map(translateSchedule),
  };
}

export async function getRaceList(): Promise<RaceListData> {
  const response = await api.get<RaceListResponse>("/v1/races");
  const data = response.data.data;

  return {
    races: data.races.map(translateRace),
    nextRace: data.nextRace ? translateRace(data.nextRace) : null,
    currentRace: data.currentRace ? translateRace(data.currentRace) : null,
  };
}
