import type { EventsResponse, Formula1Event } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getFormula1Events(): Promise<Formula1Event[]> {
  const response = await fetch(`${API_BASE_URL}/v1/formula1/events`);

  if (!response.ok) {
    throw new Error("Nao foi possivel carregar os meetings da Formula 1.");
  }

  const payload = (await response.json()) as EventsResponse;

  if (!Array.isArray(payload.data)) {
    throw new Error(
      "A resposta da API de meetings veio em um formato invalido.",
    );
  }

  return payload.data;
}
