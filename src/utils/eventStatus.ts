import type { EventStatus } from "@/api/types/race";

const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  scheduled: "Programada",
  ongoing: "Em andamento",
  completed: "Conclu\u00edda",
  cancelled: "Cancelada",
};

export function getEventStatusLabel(status: EventStatus): string {
  return EVENT_STATUS_LABELS[status];
}

export function getEventStatusPalette(
  status: EventStatus,
): "blue" | "green" | "gray" | "red" {
  if (status === "scheduled") return "blue";
  if (status === "ongoing") return "green";
  if (status === "cancelled") return "red";
  return "gray";
}
