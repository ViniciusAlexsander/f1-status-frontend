export interface ResultDriver {
  id: string;
  firstName: string;
  lastName: string;
  code: string;
  number: number;
}

export interface ResultTeam {
  id: string;
  name: string;
  shortName: string;
  color: string;
}

export interface ResultFastestLap {
  rank: number | null;
  time: string | null;
  lap: number | null;
}

export interface ResultSectorTimes {
  s1: string | null;
  s2: string | null;
  s3: string | null;
}

export interface TireStrategyEntry {
  compound: string;
  laps: number;
  isNew: boolean;
}

export interface SessionResult {
  id: string;
  position: string | number;
  lapTime: string | null;
  displayTime: string | null;
  laps: number;
  driver: ResultDriver;
  carNumber: string;
  team: ResultTeam;
  chassis?: { id: number; name: string } | null;
  engineManufacturer?: { id: number; name: string } | null;
  fastestLap: ResultFastestLap | null;
  status: string;
  points: string | number;
  gap: string | null;
  interval: string | null;
  pitStops: number;
  bestLapTime: string | null;
  bestLapNumber: number | null;
  sectors: ResultSectorTimes | null;
  tireStrategy: TireStrategyEntry[];
  gridPosition: number | null;
  q1Time: string | null;
  q2Time: string | null;
  q3Time: string | null;
}
