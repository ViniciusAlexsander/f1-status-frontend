import { api } from "@/config/axios";
import type { RaceListResponse, RaceListData } from "./types/race";

export async function getRaceList(): Promise<RaceListData> {
  const response = await api.get<RaceListResponse>("/v1/races");

  return response.data.data;
}
