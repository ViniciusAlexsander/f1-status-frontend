import type { TyreStint, TyreStintSeriesPayload } from "@/api/types/livetiming";
import { useEffect, useState } from "react";

export function useTyreStintSeriesLiveTimingData() {
  const [stints, setStints] = useState<
    Record<string, Record<string, TyreStint>>
  >({});

  useEffect(() => {
    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_BASE_URL}/v1/live-timing/topics/TyreStintSeries/stream`,
    );

    const handleUpdate = (event: MessageEvent<string>) => {
      const update: TyreStintSeriesPayload = JSON.parse(event.data);
      if (!update.Stints) return;
      setStints((current) => {
        if (update._kf) return update.Stints ?? {};

        const next = { ...current };
        for (const [number, driverStints] of Object.entries(update.Stints ?? {})) {
          const merged: Record<string, TyreStint> = { ...current[number] };
          for (const [index, stint] of Object.entries(driverStints)) {
            merged[index] = { ...current[number]?.[index], ...stint };
          }
          next[number] = merged;
        }
        return next;
      });
    };

    eventSource.addEventListener("topic_update", handleUpdate as EventListener);
    return () => {
      eventSource.removeEventListener(
        "topic_update",
        handleUpdate as EventListener,
      );
      eventSource.close();
    };
  }, []);

  return { stints };
}
