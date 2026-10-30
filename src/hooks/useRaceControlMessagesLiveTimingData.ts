import { deriveDriverPenalties } from "@/api/liveTimingFeatures";
import type {
  DriverPenalty,
  RaceControlMessage,
  RaceControlMessagesPayload,
} from "@/api/types/livetiming";
import { useEffect, useMemo, useRef, useState } from "react";

function getMessageId(message: RaceControlMessage) {
  return `${message.Utc ?? ""}|${message.Message ?? JSON.stringify(message)}`;
}

export function useRaceControlMessagesLiveTimingData() {
  const [messages, setMessages] = useState<RaceControlMessage[]>([]);
  const [newMessageBatch, setNewMessageBatch] = useState<RaceControlMessage[]>([]);
  const initializedRef = useRef(false);
  const knownIdsRef = useRef(new Set<string>());

  useEffect(() => {
    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_BASE_URL}/v1/live-timing/race-control-messages`,
    );
    const handleUpdate = (event: MessageEvent<string>) => {
      const update: RaceControlMessagesPayload = JSON.parse(event.data);
      if (!update.Messages) return;

      const unseen = update.Messages.filter((message) => {
        const id = getMessageId(message);
        if (knownIdsRef.current.has(id)) return false;
        knownIdsRef.current.add(id);
        return initializedRef.current;
      });
      initializedRef.current = true;
      if (unseen.length) setNewMessageBatch((current) => [...current, ...unseen]);

      setMessages((current) => {
        const byId = new Map(current.map((message) => [getMessageId(message), message]));
        for (const message of update.Messages!) byId.set(getMessageId(message), message);
        return [...byId.values()].sort((a, b) =>
          (a.Utc ?? "").localeCompare(b.Utc ?? ""),
        );
      });
    };

    eventSource.addEventListener(
      "race_control_messages_update",
      handleUpdate as EventListener,
    );
    return () => {
      eventSource.removeEventListener(
        "race_control_messages_update",
        handleUpdate as EventListener,
      );
      eventSource.close();
    };
  }, []);

  const penalties = useMemo(() => deriveDriverPenalties(messages), [messages]);
  return { messages, penalties, newMessageBatch };
}

export type { DriverPenalty };
