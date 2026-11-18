import { deriveDriverPenalties } from "@/api/liveTimingFeatures";
import type {
  DriverPenalty,
  ExtrapolatedClockState,
  RaceControlMessage,
  WeatherDataPayload,
} from "@/api/types/livetiming";
import { useEffect, useMemo, useRef, useState } from "react";

type TrackStatusPayload =
  | string
  | {
      Status?: string | number;
      TrackStatus?: string | number;
      Message?: string;
    };

function getTrackStatus(payload: TrackStatusPayload): string | undefined {
  if (typeof payload === "string") return payload;
  const status = payload.Status ?? payload.TrackStatus;
  if (status != null) return String(status);
  return payload.Message;
}

interface ExtrapolatedClockPayload {
  Remaining?: string;
}

function parseRemainingSeconds(value?: string): number | undefined {
  if (!value) return undefined;

  const parts = value.split(":").map(Number);
  if (
    (parts.length !== 2 && parts.length !== 3) ||
    parts.some((part) => !Number.isFinite(part) || part < 0) ||
    parts.slice(1).some((part) => part >= 60)
  ) {
    return undefined;
  }

  return Math.floor(parts.reduce((total, part) => total * 60 + part, 0));
}

function getMessageId(message: RaceControlMessage) {
  return `${message.Utc ?? ""}|${message.Message ?? JSON.stringify(message)}`;
}

function isRaceControlMessage(value: unknown): value is RaceControlMessage {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getRaceControlMessages(value: unknown): RaceControlMessage[] | null {
  if (typeof value !== "object" || value === null || !("Messages" in value)) {
    return null;
  }

  const messages = value.Messages;
  if (Array.isArray(messages)) {
    const validMessages = messages.filter(isRaceControlMessage);
    return validMessages.length === messages.length ? validMessages : null;
  }
  if (typeof messages === "object" && messages !== null) {
    const values = Object.values(messages);
    const validMessages = values.filter(isRaceControlMessage);
    return validMessages.length === values.length ? validMessages : null;
  }
  return messages == null ? [] : null;
}

export function useLiveTimingUpdates() {
  const [trackStatus, setTrackStatus] = useState<string>();
  const [weather, setWeather] = useState<WeatherDataPayload>();
  const [clock, setClock] = useState<ExtrapolatedClockState>();
  const [messages, setMessages] = useState<RaceControlMessage[]>([]);
  const [newMessageBatch, setNewMessageBatch] = useState<RaceControlMessage[]>(
    [],
  );
  const initializedMessagesRef = useRef(false);
  const knownMessageIdsRef = useRef(new Set<string>());

  useEffect(() => {
    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_BASE_URL}/v1/live-timing/conditions`,
    );

    const handleTrackStatusUpdate = (event: MessageEvent<string>) => {
      const payload: TrackStatusPayload = JSON.parse(event.data);
      const status = getTrackStatus(payload);
      if (status) setTrackStatus(status);
    };
    const handleWeatherUpdate = (event: MessageEvent<string>) => {
      const update: WeatherDataPayload = JSON.parse(event.data);
      setWeather((current) => ({ ...current, ...update }));
    };
    const handleClockUpdate = (event: MessageEvent<string>) => {
      const update: ExtrapolatedClockPayload = JSON.parse(event.data);
      const remainingSeconds = parseRemainingSeconds(update.Remaining);
      if (remainingSeconds == null) return;

      setClock({ remainingSeconds, receivedAt: Date.now() });
    };
    const handleRaceControlUpdate = (event: MessageEvent<string>) => {
      const update: unknown = JSON.parse(event.data);
      const messages = getRaceControlMessages(update);
      if (messages === null) {
        console.error("Invalid Race Control messages payload", update);
        return;
      }
      if (messages.length === 0) return;

      const unseen = messages.filter((message) => {
        const id = getMessageId(message);
        if (knownMessageIdsRef.current.has(id)) return false;
        knownMessageIdsRef.current.add(id);
        return initializedMessagesRef.current;
      });
      initializedMessagesRef.current = true;
      if (unseen.length) {
        setNewMessageBatch((current) => [...current, ...unseen]);
      }

      setMessages((current) => {
        const byId = new Map(
          current.map((message) => [getMessageId(message), message]),
        );
        for (const message of messages) {
          byId.set(getMessageId(message), message);
        }
        return [...byId.values()].sort((a, b) =>
          (a.Utc ?? "").localeCompare(b.Utc ?? ""),
        );
      });
    };

    eventSource.addEventListener(
      "track_status_update",
      handleTrackStatusUpdate as EventListener,
    );
    eventSource.addEventListener(
      "weather_data_update",
      handleWeatherUpdate as EventListener,
    );
    eventSource.addEventListener(
      "extrapolated_clock_update",
      handleClockUpdate as EventListener,
    );
    eventSource.addEventListener(
      "race_control_messages_update",
      handleRaceControlUpdate as EventListener,
    );
    return () => {
      eventSource.removeEventListener(
        "track_status_update",
        handleTrackStatusUpdate as EventListener,
      );
      eventSource.removeEventListener(
        "weather_data_update",
        handleWeatherUpdate as EventListener,
      );
      eventSource.removeEventListener(
        "extrapolated_clock_update",
        handleClockUpdate as EventListener,
      );
      eventSource.removeEventListener(
        "race_control_messages_update",
        handleRaceControlUpdate as EventListener,
      );
      eventSource.close();
    };
  }, []);

  const penalties = useMemo(() => deriveDriverPenalties(messages), [messages]);
  return { trackStatus, weather, clock, messages, penalties, newMessageBatch };
}

export type { DriverPenalty };
