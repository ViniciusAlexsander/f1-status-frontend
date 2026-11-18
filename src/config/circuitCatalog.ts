import circuitAffines from "@/config/circuitAffines.json";
import type { Location } from "@/api/types/race";

export type CircuitAffine = {
  a: number;
  b: number;
  c: number;
  d: number;
  tx: number;
  ty: number;
};

export type CircuitDefinition = {
  id: string;
  name: string;
  location: string;
  coordinates: Array<[number, number]>;
  bbox: { minLon: number; minLat: number; maxLon: number; maxLat: number };
  affine?: CircuitAffine;
};

const geojsonModules = import.meta.glob("../assets/circuits/*.geojson", {
  eager: true,
  import: "default",
}) as Record<
  string,
  {
    bbox?: number[];
    features: Array<{
      properties?: { id?: string; Location?: string; Name?: string };
      geometry: { coordinates: number[][] };
    }>;
  }
>;

const affines = circuitAffines as Record<string, CircuitAffine>;

function bboxFromCoordinates(coordinates: Array<[number, number]>) {
  let minLon = Infinity;
  let minLat = Infinity;
  let maxLon = -Infinity;
  let maxLat = -Infinity;
  for (const [lon, lat] of coordinates) {
    minLon = Math.min(minLon, lon);
    maxLon = Math.max(maxLon, lon);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  }
  return { minLon, minLat, maxLon, maxLat };
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const circuits: CircuitDefinition[] = Object.entries(geojsonModules).flatMap(
  ([path, data]) => {
    const id = path.split("/").pop()?.replace(".geojson", "");
    const feature = data.features[0];
    if (!id || !feature) return [];
    const coordinates = feature.geometry.coordinates.map(
      ([lon, lat]) => [lon, lat] as [number, number],
    );
    const bbox = data.bbox
      ? {
          minLon: data.bbox[0],
          minLat: data.bbox[1],
          maxLon: data.bbox[2],
          maxLat: data.bbox[3],
        }
      : bboxFromCoordinates(coordinates);
    return [
      {
        id,
        name: feature.properties?.Name ?? id,
        location: feature.properties?.Location ?? id,
        coordinates,
        bbox,
        affine: affines[id],
      },
    ];
  },
);

const circuitsById = new Map(circuits.map((circuit) => [circuit.id, circuit]));

const aliasToId = new Map<string, string>();

function addAlias(alias: string, id: string) {
  const key = normalize(alias);
  if (key) aliasToId.set(key, id);
}

for (const circuit of circuits) {
  addAlias(circuit.id, circuit.id);
  addAlias(circuit.name, circuit.id);
  addAlias(circuit.location, circuit.id);
}

const extraAliases: Record<string, string[]> = {
  "au-1953": ["melbourne", "albert park", "australia"],
  "cn-2004": ["shanghai", "china"],
  "jp-1962": ["suzuka", "japan"],
  "bh-2002": ["sakhir", "bahrain"],
  "sa-2021": ["jeddah", "saudi arabia", "jeddah corniche"],
  "us-2022": ["miami", "miami gardens"],
  "ca-1978": ["montreal", "montreal", "gilles villeneuve", "canada"],
  "mc-1929": ["monaco", "monte carlo"],
  "es-1991": ["barcelona", "catalunya", "barcelona catalunya"],
  "at-1969": ["spielberg", "red bull ring", "austria"],
  "gb-1948": ["silverstone", "great britain", "united kingdom", "britain"],
  "be-1925": ["spa", "spa francorchamps", "stavelot", "belgium"],
  "hu-1986": ["budapest", "hungaroring", "hungary"],
  "nl-1948": ["zandvoort", "netherlands", "dutch"],
  "it-1922": ["monza", "italy"],
  "es-2026": ["madrid", "madring"],
  "az-2016": ["baku", "azerbaijan"],
  "sg-2008": ["singapore", "marina bay"],
  "us-2012": ["austin", "cota", "circuit of the americas", "united states"],
  "mx-1962": ["mexico city", "mexico", "hermanos rodriguez"],
  "br-1940": ["sao paulo", "interlagos", "brazil", "brasil"],
  "us-2023": ["las vegas"],
  "qa-2004": ["lusail", "qatar", "losail"],
  "ae-2009": ["yas marina", "abu dhabi", "yas island"],
  "my-1999": ["sepang", "kuala lumpur", "malaysia"],
};

for (const [id, aliases] of Object.entries(extraAliases)) {
  for (const alias of aliases) addAlias(alias, id);
}

export function getCircuitById(id: string) {
  return circuitsById.get(id);
}

export function resolveCircuit(
  location?: Location | null,
  extra?: string | null,
): CircuitDefinition | undefined {
  const candidates = [
    extra,
    location?.name,
    location?.city,
    location?.country?.name,
  ].filter((value): value is string => Boolean(value));

  for (const candidate of candidates) {
    const id = aliasToId.get(normalize(candidate));
    if (id) return circuitsById.get(id);
  }

  for (const candidate of candidates) {
    const needle = normalize(candidate);
    for (const circuit of circuits) {
      if (
        normalize(circuit.name).includes(needle) ||
        normalize(circuit.location).includes(needle) ||
        needle.includes(normalize(circuit.location)) ||
        needle.includes(normalize(circuit.name))
      ) {
        return circuit;
      }
    }
  }

  return undefined;
}
