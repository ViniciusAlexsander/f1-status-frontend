import { useQuery } from "@tanstack/react-query";
import { getSessionResults } from "@/api/results";

export function useSessionResults(
  raceId?: string,
  sessionId?: string,
  enabled = true,
) {
  return useQuery({
    queryKey: ["session-results", raceId, sessionId],
    queryFn: () => getSessionResults(raceId!, sessionId!),
    enabled: enabled && Boolean(raceId && sessionId),
    staleTime: 60 * 24,
  });
}
