import { api } from "@/config/axios";
import type { SessionResult } from "./types/results";

export async function getSessionResults(
  raceId: string,
  sessionId: string,
): Promise<SessionResult[]> {
  const response = await api.get<SessionResult[]>(
    `/v1/races/${raceId}/sessions/${sessionId}/results`,
  );

  return response.data;
}
