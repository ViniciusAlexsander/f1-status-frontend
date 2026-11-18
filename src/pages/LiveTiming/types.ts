import type { SessionStatus } from "@/api/types/livetiming";

export type LiveSession = SessionStatus & { sessionTypeLabel?: string };
