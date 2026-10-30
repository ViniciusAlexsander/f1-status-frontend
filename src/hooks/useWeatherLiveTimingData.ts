import type { WeatherDataPayload } from "@/api/types/livetiming";
import { useEffect, useState } from "react";

export function useWeatherLiveTimingData() {
  const [weather, setWeather] = useState<WeatherDataPayload>();

  useEffect(() => {
    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_BASE_URL}/v1/live-timing/weather-data`,
    );

    const handleUpdate = (event: MessageEvent<string>) => {
      const update: WeatherDataPayload = JSON.parse(event.data);
      setWeather((current) => ({ ...current, ...update }));
    };

    eventSource.addEventListener("weather_data_update", handleUpdate as EventListener);
    return () => {
      eventSource.removeEventListener(
        "weather_data_update",
        handleUpdate as EventListener,
      );
      eventSource.close();
    };
  }, []);

  return { weather };
}
