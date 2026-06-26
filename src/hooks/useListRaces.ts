import { getRaceList } from "../api/races";
import { useQuery } from "@tanstack/react-query";

export function useListRaces() {
  return useQuery({
    queryKey: ["list-races"],
    queryFn: getRaceList,
    staleTime: 60 * 24,
  });
}
