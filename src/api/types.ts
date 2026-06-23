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

export interface EventLocation {
  id: string;
  name: string;
  city: string;
  country: Country;
}

export interface EventSchedule {
  id: string;
  name: string;
  type: ScheduleType;
  startTime: string;
  endTime: string;
  status: EventStatus;
}

export interface Formula1Event {
  id: string;
  name: string;
  dateStart: string;
  dateEnd: string;
  status: EventStatus;
  location: EventLocation;
  sportId: string;
  schedule: EventSchedule[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface EventsResponse {
  data: Formula1Event[];
  meta: PaginationMeta;
}
