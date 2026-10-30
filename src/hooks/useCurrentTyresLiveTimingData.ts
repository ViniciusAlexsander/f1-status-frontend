import {
  normalizeTyreInfo,
  type CurrentTyresPayload,
  type ICurrentTyres,
} from "@/api/types/livetiming";
import { useEffect, useState } from "react";

export function useCurrentTyresLiveTimingData() {
  const [currentTyres, setCurrentTyres] = useState<ICurrentTyres | undefined>();

  useEffect(() => {
    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_BASE_URL}/v1/live-timing/current-tyres`,
    );

    eventSource.onopen = () => {
      console.log("SSE conectado - current tyres");
    };

    const handleTyreUpdate = (event: MessageEvent) => {
      const { data } = event;

      console.log("tyre_update", data);

      const apiTyres: CurrentTyresPayload = JSON.parse(data);
      const currentTyres: ICurrentTyres = {
        _kf: apiTyres._kf,
        Tyres: Object.fromEntries(
          Object.entries(apiTyres.Tyres ?? {}).map(([number, tyre]) => [
            number,
            normalizeTyreInfo(tyre),
          ]),
        ),
      };

      setCurrentTyres(currentTyres);
    };

    eventSource.addEventListener("current_tyres_update", handleTyreUpdate);
    eventSource.onmessage = handleTyreUpdate;

    eventSource.onerror = (err) => {
      console.error("Erro SSE:", err);
    };

    return () => {
      eventSource.removeEventListener("current_tyres_update", handleTyreUpdate);
      eventSource.onmessage = null;
      eventSource.close();
    };
  }, []);

  console.log("currentTyres", currentTyres);

  return { currentTyres };
}
