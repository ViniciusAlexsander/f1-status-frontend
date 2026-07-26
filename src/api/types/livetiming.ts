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
}

export function timingToArray(
  timing: TimingUpdate,
  driversStandings: DriverData[],
): DriverTimingItem[] {
  const driversPosition: DriverTimingItem[] = Object.entries(
    timing.payload.Lines,
  )
    .map(([id, driver]) => ({
      id,
      ...driver,
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
  });

  return driversPosition;
}
