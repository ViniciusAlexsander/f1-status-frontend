import { getConstructorsStandings } from "../api/standings";
import { useQuery } from "@tanstack/react-query";

export function useConstructorsStandings() {
  return useQuery({
    queryKey: ["useConstructorsStandings"],
    queryFn: getConstructorsStandings,
    staleTime: 60 * 24,
  });
}
