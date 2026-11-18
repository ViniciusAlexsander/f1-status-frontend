import { useEffect, useState } from "react";

export type LiveCarPosition = {
  x: number;
  y: number;
  status: string;
};

export type LivePositionSnapshot = {
  timestamp: string | null;
  cars: Record<string, LiveCarPosition>;
  receivedAt: number;
};

export function useLivePositionData() {
  const [snapshot, setSnapshot] = useState<LivePositionSnapshot>();

  useEffect(() => {
    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_BASE_URL}/v1/live-timing/position`,
    );

    const handleUpdate = (event: MessageEvent<string>) => {
      const payload = JSON.parse(event.data) as Omit<
        LivePositionSnapshot,
        "receivedAt"
      >;
      if (!payload?.cars) return;
      setSnapshot({ ...payload, receivedAt: Date.now() });
    };

    eventSource.addEventListener("position_update", handleUpdate);
    return () => {
      eventSource.removeEventListener("position_update", handleUpdate);
      eventSource.close();
    };
  }, []);

  return snapshot;
}
