import { type SessionStatus } from "@/api/types/livetiming";
import { useEffect, useState } from "react";

export function useSessionLiveTimingData() {
  const [session, setSession] = useState<SessionStatus | undefined>();

  useEffect(() => {
    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_BASE_URL}/v1/live-timing/session`,
    );

    eventSource.onopen = () => {
      console.log("SSE conectado - session");
    };

    const handleSessionUpdate = (event: Event) => {
      const { data } = event as MessageEvent;

      const session: SessionStatus = JSON.parse(data);

      console.log({ session });

      setSession(session);
    };

    eventSource.addEventListener("session_update", handleSessionUpdate);

    eventSource.onerror = (err) => {
      console.error("Erro SSE:", err);
    };

    return () => {
      eventSource.removeEventListener("session_update", handleSessionUpdate);
      eventSource.close();
    };
  }, []);

  return { session };
}
