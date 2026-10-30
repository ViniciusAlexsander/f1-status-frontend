import type { DriverData } from "./driver";

export interface TimingUpdate {
  topic: string;
  payload: TimingPayload;
}

export interface TimingPayload {
  Lines: Record<string, DriverTiming>;
}

export interface SessionStatus {
  lap: number;
  trackStatus: string;
  sessionStatus: string;
  qualifyingPart?: number | null;
  qualifyingPartStartedAt?: string | null;
  qualifyingPartFinishedAt?: string | null;
  qualifyingRedFlagIntervals?: QualifyingRedFlagInterval[];
}

export interface QualifyingRedFlagInterval {
  startedAt: string;
  endedAt: string | null;
}

export interface SessionDataPayload {
  Series?: SessionDataSeriesItem[];
  StatusSeries?: SessionDataStatusItem[];
  _kf?: boolean;
}

export interface SessionDataSeriesItem {
  Utc: string;
  Lap?: number;
  QualifyingPart?: number;
}

export interface SessionDataStatusItem {
  Utc: string;
  TrackStatus?: string;
  SessionStatus?: string;
}

export interface CurrentTyresPayload {
  Tyres?: Record<string, CurrentTyrePayload>;
  _kf?: boolean;
}

export interface CurrentTyrePayload {
  Compound: string;
  New?: boolean | string;
}

export interface TyreStintSeriesPayload {
  Stints?: Record<string, TyreStint[]>;
  _kf?: boolean;
}

export interface TyreStint {
  Compound?: string;
  New?: boolean | string;
  TyresNotChanged?: number | string;
  TotalLaps?: number | string;
  StartLaps?: number | string;
}

export interface RaceControlMessagesPayload {
  Messages?: RaceControlMessage[];
  _kf?: boolean;
}

export interface RaceControlMessage {
  Utc?: string;
  Lap?: number | string;
  Category?: string;
  Flag?: string;
  Scope?: string;
  Message?: string;
  RacingNumber?: string;
  [key: string]: unknown;
}

export type PenaltyStatus = "pending" | "served" | "cancelled";
export type PenaltyKind = "time" | "drive-through" | "stop-and-go";

export interface DriverPenalty {
  id: string;
  racingNumber: string;
  kind: PenaltyKind;
  seconds?: number;
  issuedAt?: string;
  resolvedAt?: string;
  status: PenaltyStatus;
  message: string;
}

export interface WeatherDataPayload {
  AirTemp?: number;
  Humidity?: number;
  Pressure?: number;
  Rainfall?: number;
  TrackTemp?: number;
  WindDirection?: number;
  WindSpeed?: number;
  _kf?: boolean;
}

export interface DriverTiming {
  TimeDiffToFastest?: string;
  TimeDiffToPositionAhead?: string;

  GapToLeader?: string;
  IntervalToPositionAhead?: {
    Value: string;
    Catching: false;
  };

  Line?: number;
  Position?: string;
  ShowPosition?: boolean;
  RacingNumber?: string;

  Retired?: boolean;
  InPit?: boolean;
  PitOut?: boolean;
  Stopped?: boolean;

  Status?: number;

  Sectors?: Record<string, Sector>;
  Speeds?: Record<string, Speed>;

  BestLapTime?: LapTime;
  LastLapTime?: LastLapTime;

  NumberOfLaps?: number;
  NumberOfPitStops?: number;
}

export interface Sector {
  Value?: string;
  PreviousValue?: string;

  OverallFastest?: boolean;
  PersonalFastest?: boolean;
  Stopped?: boolean;

  Segments?: Record<string, Segment>;
}

export interface Segment {
  Status?: number;
}

export interface Speed {
  Value?: string;
  Status?: number;

  OverallFastest?: boolean;
  PersonalFastest?: boolean;
}

export interface LapTime {
  Value?: string;
  Lap?: number;
}

export interface LastLapTime {
  Value?: string;
  Status?: number;

  OverallFastest?: boolean;
  PersonalFastest?: boolean;
}

export interface DriverTimingItem extends DriverTiming {
  id: string;
  driverData?: DriverData;
  currentTyre?: TyreInfo;
  currentStint?: TyreStint;
  currentStintLaps?: number;
  isFastestLap?: boolean;
  positionChange?: number;
}

export function timingToArray(
  timing: TimingUpdate,
  driversStandings: DriverData[],
  tyres?: Record<string, TyreInfo>,
  stints?: Record<string, TyreStint[]>,
): DriverTimingItem[] {
  const driversPosition: DriverTimingItem[] = Object.entries(
    timing.payload.Lines,
  )
    .map(([id, driver]) => ({
      id,
      ...driver,
      isFastestLap: false,
    }))
    .sort(
      (a, b) =>
        Number(a.Position ?? Number.MAX_SAFE_INTEGER) -
        Number(b.Position ?? Number.MAX_SAFE_INTEGER),
    );

  driversPosition.forEach((driver) => {
    driver.driverData = driversStandings.find(
      (d) => driver.RacingNumber && d.number.toString() === driver.RacingNumber,
    );

    if (driver.RacingNumber && tyres) {
      driver.currentTyre = tyres[driver.RacingNumber];
    }

    if (driver.RacingNumber && stints) {
      driver.currentStint = stints[driver.RacingNumber]?.at(-1);
      const stintLaps = Number(driver.currentStint?.TotalLaps);
      if (Number.isFinite(stintLaps)) driver.currentStintLaps = stintLaps;
    }
  });

  const validBestLaps = driversPosition
    .map((driver) => parseLapTime(driver.BestLapTime?.Value))
    .filter((time): time is number => time !== undefined);
  const fastestLap = validBestLaps.length ? Math.min(...validBestLaps) : undefined;

  if (fastestLap !== undefined) {
    driversPosition.forEach((driver) => {
      driver.isFastestLap = parseLapTime(driver.BestLapTime?.Value) === fastestLap;
    });
  }

  return driversPosition;
}

export function parseLapTime(value?: string): number | undefined {
  if (!value?.trim()) return undefined;
  const parts = value.trim().split(":");
  if (parts.length > 2) return undefined;
  const seconds = Number(parts.at(-1));
  if (!Number.isFinite(seconds)) return undefined;
  const minutes = parts.length === 2 ? Number(parts[0]) : 0;
  if (!Number.isFinite(minutes) || minutes < 0 || seconds < 0) return undefined;
  return minutes * 60 + seconds;
}

export interface TyreCompound {
  label: string;
  abbreviation: string;
  color: string;
}

export interface TyreInfo {
  Compound: TyreCompound;
  New: boolean;
}

const TYRE_COMPOUNDS: Record<string, TyreCompound> = {
  soft: { label: "SOFT", abbreviation: "S", color: "#E10600" },
  medium: { label: "MEDIUM", abbreviation: "M", color: "#FFD700" },
  hard: { label: "HARD", abbreviation: "H", color: "#FFFFFF" },
  intermediate: { label: "INTERMEDIATE", abbreviation: "I", color: "#43B02A" },
  wet: { label: "WET", abbreviation: "W", color: "#0067FF" },
};

export function normalizeTyreInfo(
  tyre: CurrentTyrePayload,
): TyreInfo {
  const compound = tyre.Compound.trim().toLowerCase();

  return {
    New: tyre.New === true || tyre.New === "true",
    Compound: TYRE_COMPOUNDS[compound] ?? {
      label: compound,
      abbreviation: compound.charAt(0).toUpperCase(),
      color: "#808080",
    },
  };
}

export interface ICurrentTyres {
  Tyres: Record<string, TyreInfo>;
  _kf?: boolean;
}
