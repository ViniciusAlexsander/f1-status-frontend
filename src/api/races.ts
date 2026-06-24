import type { RaceListResponse, RaceListData } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getRaceList(): Promise<RaceListData> {
  const response = await fetch(`${API_BASE_URL}/v1/races`);

  if (!response.ok) {
    throw new Error("Nao foi possivel carregar os meetings da Formula 1.");
  }

  const payload = (await response.json()) as RaceListResponse;

  console.log({ payload });

  if (!payload.data) {
    throw new Error(
      "A resposta da API de meetings veio em um formato invalido.",
    );
  }

  return payload.data;
}
