import type { IconType } from "react-icons";
import {
  RiCloudyLine,
  RiDrizzleLine,
  RiFoggyLine,
  RiRainyLine,
  RiSnowyLine,
  RiSunCloudyLine,
  RiSunLine,
  RiTempHotLine,
  RiThunderstormsLine,
} from "react-icons/ri";

export interface WeatherSnapshot {
  t_max: number;
  t_min: number;
  precip_mm: number;
  precip_prob: number;
  weather_code: number;
  wind_speed: number;
  wind_gust: number;
  wind_dir: number;
}

export interface ForecastDay {
  date: string;
  weather: WeatherSnapshot;
}

export interface RaceForecast {
  days: ForecastDay[];
}

export function getWeatherIcon(code: number): IconType {
  if (code === 0) return RiSunLine;
  if (code <= 2) return RiSunCloudyLine;
  if (code === 3) return RiCloudyLine;
  if (code === 45 || code === 48) return RiFoggyLine;
  if (code >= 51 && code <= 57) return RiDrizzleLine;
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return RiRainyLine;
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return RiSnowyLine;
  if (code >= 95 && code <= 99) return RiThunderstormsLine;
  return RiTempHotLine;
}

export function getWeatherIconColor(code: number): string {
  if (code === 0) return "#FACC15";
  if (code <= 2) return "#FBBF24";
  if (code === 3) return "#94A3B8";
  if (code === 45 || code === 48) return "#A8A29E";
  if (code >= 51 && code <= 57) return "#60A5FA";
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "#3B82F6";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "#E2E8F0";
  if (code >= 95 && code <= 99) return "#A855F7";
  return "#F97316";
}

export function formatWindDirection(degrees: number) {
  const directions = ["N", "NE", "L", "SE", "S", "SO", "O", "NO"] as const;
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

export function formatWeatherTemps(weather: WeatherSnapshot) {
  return `${Math.round(weather.t_max)}° / ${Math.round(weather.t_min)}°`;
}

export function formatWeatherPrecip(weather: WeatherSnapshot) {
  return `${Math.round(weather.precip_prob)}%`;
}

export function formatWeatherWind(weather: WeatherSnapshot) {
  return `${Math.round(weather.wind_speed)} km/h`;
}

export function formatForecastDayLabel(date: string) {
  const weekday = new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR", {
    weekday: "short",
  });
  return weekday.replace(/\.$/u, "").trim().toUpperCase();
}
