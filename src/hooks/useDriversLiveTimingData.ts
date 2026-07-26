import { DRIVERS_DATA } from "@/api/driverConstants";
import {
  timingToArray,
  type DriverTimingItem,
  type TimingUpdate,
} from "@/api/types/livetiming";
import { useEffect, useState } from "react";

export function useDriversLiveTimingData() {
  const [drivers, setDrivers] = useState<DriverTimingItem[]>([]);

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

      setDrivers(timingToArray(timing, DRIVERS_DATA));
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
