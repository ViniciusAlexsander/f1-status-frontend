import { type SessionStatus } from "@/api/types/livetiming";
import { useEffect, useState } from "react";

type SessionStatusView = SessionStatus & { sessionTypeLabel?: string };

export function useSessionLiveTimingData() {
  const [session, setSession] = useState<SessionStatusView | undefined>();

  useEffect(() => {
    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_BASE_URL}/v1/live-timing/session`,
    );

    eventSource.onopen = () => {
      console.log("SSE conectado - session");
    };

    const handleSessionUpdate = (event: Event) => {
      const { data } = event as MessageEvent;

      const session: SessionStatusView = JSON.parse(data);

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
