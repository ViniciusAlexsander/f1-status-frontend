import { api } from "@/config/axios";
import type { DriverStandingsData } from "./types/standings";

export async function getDriversStandings(): Promise<DriverStandingsData[]> {
  const response = await api.get<DriverStandingsData[]>(
    "/v1/standings/drivers",
  );

  return response.data;
}
