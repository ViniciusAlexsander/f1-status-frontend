import { useEffect, useState } from "react";
import { getRaceList } from "./races";
import type { RaceListData } from "./types";

interface UseFormula1EventsResult {
  raceList: RaceListData | undefined;
  loading: boolean;
  error: string | null;
}

export function useListRaces(): UseFormula1EventsResult {
  const [raceList, setRaceListData] = useState<RaceListData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadEvents() {
      try {
        setLoading(true);
        setError(null);

        const { nextRace, races } = await getRaceList();
        // const sortedEvents = [...races].sort(
        //   (a, b) =>
        //     new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime(),
        // );

        if (isMounted) {
          setRaceListData({
            nextRace,
            races,
          });
        }
      } catch (caughtError) {
        if (isMounted) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Nao foi possivel carregar os meetings.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  return { raceList, loading, error };
}
