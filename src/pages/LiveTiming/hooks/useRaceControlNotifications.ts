import type { RaceControlMessage } from "@/api/types/livetiming";
import { toaster } from "@/components/ui/toaster";
import { useEffect, useRef, useState } from "react";

export function useRaceControlNotifications(
  newMessageBatch: RaceControlMessage[],
) {
  const [unreadMessages, setUnreadMessages] = useState(0);
  const historyRef = useRef<HTMLDivElement>(null);
  const notifiedMessageIdsRef = useRef(new Set<string>());
  const raceControlToastIdRef = useRef<string | null>(null);

  useEffect(() => {
    const freshMessages = newMessageBatch.filter((message) => {
      const id = `${message.Utc ?? ""}|${message.Message ?? JSON.stringify(message)}`;
      if (notifiedMessageIdsRef.current.has(id)) return false;
      notifiedMessageIdsRef.current.add(id);
      return true;
    });
    if (!freshMessages.length) return;

    setUnreadMessages((count) => count + freshMessages.length);
    const latest = freshMessages.at(-1);
    if (raceControlToastIdRef.current) {
      toaster.dismiss(raceControlToastIdRef.current);
    }
    raceControlToastIdRef.current = toaster.create({
      title:
        freshMessages.length === 1
          ? "Nova mensagem do Race Control"
          : `${freshMessages.length} novas mensagens do Race Control`,
      description:
        latest?.Message ?? "A direção de prova publicou uma atualização.",
      type: "info",
      duration: 6500,
      closable: true,
    });
  }, [newMessageBatch]);

  useEffect(() => {
    const node = historyRef.current;
    if (!node || unreadMessages === 0) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setUnreadMessages(0);
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [unreadMessages]);

  const openHistory = () => {
    historyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setUnreadMessages(0);
  };

  return { unreadMessages, historyRef, openHistory };
}
