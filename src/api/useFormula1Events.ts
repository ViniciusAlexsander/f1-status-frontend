import { useEffect, useState } from "react";
import { getFormula1Events } from "./events";
import type { Formula1Event } from "./types";

interface UseFormula1EventsResult {
  events: Formula1Event[];
  loading: boolean;
  error: string | null;
}

export function useFormula1Events(): UseFormula1EventsResult {
  const [events, setEvents] = useState<Formula1Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadEvents() {
      try {
        setLoading(true);
        setError(null);

        const formula1Events = await getFormula1Events();
        const sortedEvents = [...formula1Events].sort(
          (a, b) =>
            new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime(),
        );

        if (isMounted) {
          setEvents(sortedEvents);
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

  return { events, loading, error };
}
