import type {
  DriverPenalty,
  PenaltyKind,
  PenaltyStatus,
  RaceControlMessage,
} from "./types/livetiming";

type ParsedPenalty = Omit<DriverPenalty, "id" | "issuedAt" | "resolvedAt"> & {
  status: PenaltyStatus;
};

function parsePenaltyMessage(message: RaceControlMessage): ParsedPenalty | undefined {
  const text = message.Message?.trim();
  if (!text || /under investigation|investigation/i.test(text)) return undefined;

  const resolution = text.match(/\bPENALTY\s+(SERVED|CANCELLED|CANCELED|RESCINDED)\s*[-:]\s*(.+)$/i);
  const status: PenaltyStatus = resolution
    ? resolution[1].toUpperCase() === "SERVED"
      ? "served"
      : "cancelled"
    : "pending";
  const penaltyText = resolution?.[2] ?? text;
  const carNumber =
    message.RacingNumber ?? penaltyText.match(/\bCAR\s+(\d+)\b/i)?.[1];
  if (!carNumber) return undefined;

  const seconds = penaltyText.match(/\b(\d+)\s*SECONDS?\s+TIME PENALTY\b/i);
  let kind: PenaltyKind;
  if (seconds) {
    kind = "time";
  } else if (/\bDRIVE[- ]THROUGH(?:\s+PENALTY)?\b/i.test(penaltyText)) {
    kind = "drive-through";
  } else if (/\bSTOP[- ]AND[- ]GO(?:\s+PENALTY)?\b/i.test(penaltyText)) {
    kind = "stop-and-go";
  } else {
    return undefined;
  }

  return {
    racingNumber: carNumber,
    kind,
    seconds: seconds ? Number(seconds[1]) : undefined,
    status,
    message: text,
  };
}

export function deriveDriverPenalties(
  messages: RaceControlMessage[],
): DriverPenalty[] {
  const ordered = [...messages].sort((a, b) =>
    (a.Utc ?? "").localeCompare(b.Utc ?? ""),
  );
  const penalties: DriverPenalty[] = [];

  for (const message of ordered) {
    const parsed = parsePenaltyMessage(message);
    if (!parsed) continue;

    let matchingIndex = -1;
    for (let index = penalties.length - 1; index >= 0; index -= 1) {
      const penalty = penalties[index];
      if (
        penalty.racingNumber === parsed.racingNumber &&
        penalty.kind === parsed.kind &&
        penalty.seconds === parsed.seconds &&
        penalty.status === "pending"
      ) {
        matchingIndex = index;
        break;
      }
    }

    if (parsed.status === "pending") {
      const issuedAt = message.Utc;
      const id = [
        parsed.racingNumber,
        parsed.kind,
        parsed.seconds ?? "",
        issuedAt ?? message.Message,
      ].join(":");
      penalties.push({ ...parsed, id, issuedAt });
    } else if (matchingIndex >= 0) {
      penalties[matchingIndex] = {
        ...penalties[matchingIndex],
        status: parsed.status,
        resolvedAt: message.Utc,
        message: message.Message ?? penalties[matchingIndex].message,
      };
    }
  }

  return penalties;
}

export enum DriverStatus {
  In = "IN",
  Out = "OUT",
  Stopped = "STOP",
  Retired = "RET",
}

export function getDriverStatus(driver: {
  Retired?: boolean;
  Stopped?: boolean;
  InPit?: boolean;
  PitOut?: boolean;
}): DriverStatus | undefined {
  if (driver.Retired) return DriverStatus.Retired;
  if (driver.Stopped) return DriverStatus.Stopped;
  if (driver.InPit) return DriverStatus.In;
  if (driver.PitOut) return DriverStatus.Out;
  return undefined;
}

export function getQualifyingRemainingSeconds(
  part: number,
  startedAt: string | null | undefined,
  status: string | null | undefined,
  redFlagIntervals: Array<{ startedAt: string; endedAt: string | null }> = [],
  now = Date.now(),
): number | undefined {
  const durationSeconds: Record<number, number> = { 1: 18 * 60, 2: 15 * 60, 3: 13 * 60 };
  const duration = durationSeconds[part];
  const start = startedAt ? Date.parse(startedAt) : Number.NaN;
  if (!duration || !Number.isFinite(start)) return undefined;
  if (status === "Finished") return 0;

  let elapsedMs = Math.max(0, now - start);
  for (const interval of redFlagIntervals) {
    const redStart = Date.parse(interval.startedAt);
    const redEnd = interval.endedAt ? Date.parse(interval.endedAt) : now;
    if (!Number.isFinite(redStart) || !Number.isFinite(redEnd)) continue;
    elapsedMs -= Math.max(0, Math.min(now, redEnd) - Math.max(start, redStart));
  }

  return Math.max(0, duration - Math.floor(Math.max(0, elapsedMs) / 1000));
}

export function formatRemainingTime(seconds: number): string {
  const remaining = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(remaining / 60);
  return `${String(minutes).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`;
}
