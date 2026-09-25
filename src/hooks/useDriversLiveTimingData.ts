import { DRIVERS_DATA } from "@/api/driverConstants";
import {
  timingToArray,
  type DriverTimingItem,
  type TimingUpdate,
} from "@/api/types/livetiming";
import { useEffect, useRef, useState } from "react";
import { useCurrentTyresLiveTimingData } from "./useCurrentTyresLiveTimingData";

export function useDriversLiveTimingData() {
  const [drivers, setDrivers] = useState<DriverTimingItem[]>([]);
  const { currentTyres } = useCurrentTyresLiveTimingData();
  const currentTyresRef = useRef(currentTyres);
  const latestTimingRef = useRef<TimingUpdate | undefined>(undefined);

  useEffect(() => {
    currentTyresRef.current = currentTyres;

    if (latestTimingRef.current && currentTyres) {
      setDrivers(
        timingToArray(
          latestTimingRef.current,
          DRIVERS_DATA,
          currentTyres.Tyres,
        ),
      );
    }
  }, [currentTyres]);

  useEffect(() => {
    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_BASE_URL}/v1/live-timing/timing`,
    );

    eventSource.onopen = () => {
      console.log("SSE conectado - drivers");
    };

    const handleTimingUpdate = (event: Event) => {
      const { data } = event as MessageEvent;

      const timing: TimingUpdate = JSON.parse(data);
      latestTimingRef.current = timing;

      setDrivers(
        timingToArray(timing, DRIVERS_DATA, currentTyresRef.current?.Tyres),
      );
    };

    eventSource.addEventListener("timing_update", handleTimingUpdate);

    eventSource.onerror = (err) => {
      console.error("Erro SSE:", err);
    };

    return () => {
      eventSource.removeEventListener("timing_update", handleTimingUpdate);
      eventSource.close();
    };
  }, []);

  return { drivers };
}
