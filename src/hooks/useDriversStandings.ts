import { getDriversStandings } from "../api/standings";
import { useQuery } from "@tanstack/react-query";

export function useDriversStandings() {
  return useQuery({
    queryKey: ["useDriversStandings"],
    queryFn: getDriversStandings,
    staleTime: 60 * 24,
  });
}
