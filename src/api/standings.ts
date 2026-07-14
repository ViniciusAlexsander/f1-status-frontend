import { api } from "@/config/axios";
import type {
  DriverStandingsData,
  IConstructorStandingsData,
} from "./types/standings";

export async function getDriversStandings(): Promise<DriverStandingsData[]> {
  const response = await api.get<DriverStandingsData[]>(
    "/v1/standings/drivers",
  );

  return response.data;
}

export async function getConstructorsStandings(): Promise<
  IConstructorStandingsData[]
> {
  const response = await api.get<IConstructorStandingsData[]>(
    "/v1/standings/constructors",
  );

  return response.data;
}
