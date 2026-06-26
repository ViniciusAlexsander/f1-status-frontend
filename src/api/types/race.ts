export type EventStatus = "scheduled" | "completed" | "cancelled";

export type ScheduleType =
  | "practice"
  | "qualifying"
  | "race"
  | "sprint"
  | "sprint_qualifying";

export interface Country {
  name: string;
  twoCode: string | null;
  threeCode: string | null;
}

export interface Location {
  id: string;
  name: string;
  city: string;
  country: Country;
}

export interface Schedule {
  id: string;
  name: string;
  type: ScheduleType;
  startTime: string;
  endTime: string;
  status: EventStatus;
}

export interface RaceWeek {
  id: string;
  name: string;
  dateStart: string;
  dateEnd: string;
  status: EventStatus;
  location: Location;
  sportId: string;
  schedule: Schedule[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface RaceListData {
  races: RaceWeek[];
  nextRace: RaceWeek;
}

export interface RaceListResponse {
  data: RaceListData;
  meta: PaginationMeta;
}
