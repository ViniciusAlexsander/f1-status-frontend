export type EventStatus = "scheduled" | "completed" | "cancelled" | "ongoing";

export type ScheduleType =
  "practice" | "qualifying" | "race" | "sprint" | "sprint_qualifying";

export interface Country {
  name: string;
  twoCode: string | null;
  threeCode: string | null;
}

export interface WeatherSnapshot {
  t_max: number;
  t_min: number;
  precip_mm: number;
  precip_prob: number;
  weather_code: number;
  wind_speed: number;
  wind_gust: number;
  wind_dir: number;
}

export interface ForecastDay {
  date: string;
  weather: WeatherSnapshot;
}

export interface RaceForecast {
  days: ForecastDay[];
}

export interface Location {
  id: string;
  name: string;
  city: string;
  country: Country;
}

export interface ApiSchedule {
  id: string;
  name: string;
  type: ScheduleType;
  startTime: string;
  endTime: string;
  status: EventStatus;
  weather?: WeatherSnapshot | null;
}

export interface Schedule extends ApiSchedule {
  statusLabel: string;
  weather?: WeatherSnapshot | null;
}

export interface ApiRaceWeek {
  id: string;
  name: string;
  dateStart: string;
  dateEnd: string;
  status: EventStatus;
  location: Location;
  sportId: string;
  schedule: ApiSchedule[];
  forecast?: RaceForecast | null;
}

export interface RaceWeek extends Omit<ApiRaceWeek, "schedule"> {
  statusLabel: string;
  schedule: Schedule[];
  forecast?: RaceForecast | null;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiRaceListData {
  races: ApiRaceWeek[];
  nextRace: ApiRaceWeek | null;
  currentRace: ApiRaceWeek | null;
}

export interface RaceListData {
  races: RaceWeek[];
  nextRace: RaceWeek | null;
  currentRace: RaceWeek | null;
}

export interface RaceListResponse {
  data: ApiRaceListData;
  meta: PaginationMeta;
}
