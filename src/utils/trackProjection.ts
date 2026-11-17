import type { CircuitAffine, CircuitDefinition } from "@/config/circuitCatalog";

export const TRACK_VIEWBOX = { width: 1000, height: 620, padding: 48 };

export type ProjectedPoint = { x: number; y: number };

function scaleFor(circuit: CircuitDefinition) {
  const { minLon, minLat, maxLon, maxLat } = circuit.bbox;
  const dx = maxLon - minLon || 1;
  const dy = maxLat - minLat || 1;
  const innerW = TRACK_VIEWBOX.width - TRACK_VIEWBOX.padding * 2;
  const innerH = TRACK_VIEWBOX.height - TRACK_VIEWBOX.padding * 2;
  const scale = Math.min(innerW / dx, innerH / dy);
  const offsetX =
    (TRACK_VIEWBOX.width - dx * scale) / 2;
  const offsetY =
    (TRACK_VIEWBOX.height - dy * scale) / 2;
  return { scale, offsetX, offsetY, minLon, maxLat };
}

export function projectLonLat(
  circuit: CircuitDefinition,
  lon: number,
  lat: number,
): ProjectedPoint {
  const { scale, offsetX, offsetY, minLon, maxLat } = scaleFor(circuit);
  return {
    x: offsetX + (lon - minLon) * scale,
    y: offsetY + (maxLat - lat) * scale,
  };
}

export function trackPolyline(circuit: CircuitDefinition) {
  return circuit.coordinates
    .map(([lon, lat]) => {
      const point = projectLonLat(circuit, lon, lat);
      return `${point.x.toFixed(2)},${point.y.toFixed(2)}`;
    })
    .join(" ");
}

const MARKER_VIEW_MARGIN = 32;

/** Tight viewBox around the projected track so the SVG fills its layout box. */
export function trackViewBoxBounds(circuit: CircuitDefinition) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [lon, lat] of circuit.coordinates) {
    const point = projectLonLat(circuit, lon, lat);
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }
  if (!Number.isFinite(minX)) {
    return {
      x: 0,
      y: 0,
      width: TRACK_VIEWBOX.width,
      height: TRACK_VIEWBOX.height,
    };
  }
  const pad = MARKER_VIEW_MARGIN;
  return {
    x: minX - pad,
    y: minY - pad,
    width: maxX - minX + pad * 2,
    height: maxY - minY + pad * 2,
  };
}

export function projectCar(
  circuit: CircuitDefinition,
  x: number,
  y: number,
  affine: CircuitAffine,
): ProjectedPoint {
  const lon = affine.a * x + affine.b * y + affine.tx;
  const lat = affine.c * x + affine.d * y + affine.ty;
  return projectLonLat(circuit, lon, lat);
}
