import { DRIVERS_DATA } from "@/api/driverConstants";
import type { Location } from "@/api/types/race";
import { resolveCircuit } from "@/config/circuitCatalog";
import {
  useLivePositionData,
  type LiveCarPosition,
  type LivePositionSnapshot,
} from "@/hooks/useLivePositionData";
import {
  projectCar,
  trackPolyline,
  trackViewBoxBounds,
} from "@/utils/trackProjection";
import { Box, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";

const DRIVERS_BY_NUMBER = new Map(
  DRIVERS_DATA.map((driver) => [String(driver.number), driver]),
);

type TrackMapProps = {
  location?: Location | null;
  fallbackName?: string | null;
};

function useInterpolatedCars(snapshot?: LivePositionSnapshot) {
  const previousRef = useRef<LivePositionSnapshot | undefined>(undefined);
  const [cars, setCars] = useState<Record<string, LiveCarPosition>>({});

  useEffect(() => {
    if (!snapshot) return;
    const from = previousRef.current;
    previousRef.current = snapshot;
    const startedAt = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = from ? Math.min(1, (now - startedAt) / 220) : 1;
      const next: Record<string, LiveCarPosition> = {};
      for (const [racingNumber, car] of Object.entries(snapshot.cars)) {
        const previous = from?.cars[racingNumber] ?? car;
        next[racingNumber] = {
          ...car,
          x: previous.x + (car.x - previous.x) * t,
          y: previous.y + (car.y - previous.y) * t,
        };
      }
      setCars(next);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [snapshot]);

  return cars;
}

export function TrackMap({ location, fallbackName }: TrackMapProps) {
  const circuit = useMemo(
    () => resolveCircuit(location, fallbackName),
    [fallbackName, location],
  );
  const snapshot = useLivePositionData();
  const liveCars = useInterpolatedCars(snapshot);
  const path = circuit ? trackPolyline(circuit) : "";
  const svgViewBox = useMemo(
    () => (circuit ? trackViewBoxBounds(circuit) : null),
    [circuit],
  );

  const markers = useMemo(() => {
    if (!circuit?.affine) return [];
    const affine = circuit.affine;
    return Object.entries(liveCars).flatMap(([racingNumber, car]) => {
      const point = projectCar(circuit, car.x, car.y, affine);
      const driver = DRIVERS_BY_NUMBER.get(racingNumber);
      return [
        {
          racingNumber,
          ...point,
          code: driver?.code ?? racingNumber,
          color: driver?.teams[0]?.color ?? "#94a3b8",
          offTrack: car.status !== "OnTrack",
        },
      ];
    });
  }, [circuit, liveCars]);

  return (
    <Box
      w="full"
      borderWidth="1px"
      borderColor="border"
      borderRadius="lg"
      bg="card"
      overflow="hidden"
      alignSelf={{ lg: "start" }}
    >
      {!circuit ? (
        <Box px="5" py="10" textAlign="center">
          <Text fontFamily="mono" fontSize="sm" textTransform="uppercase">
            Mapa do circuito indisponível
          </Text>
          <Text mt="2" fontSize="sm" color="fg.muted">
            Não há layout para o local da sessão atual.
          </Text>
        </Box>
      ) : (
        <Box px={{ base: 1, md: 2 }} py={{ base: 1, md: 2 }}>
          <Box
            w="full"
            aspectRatio={
              svgViewBox ? svgViewBox.width / svgViewBox.height : 1000 / 620
            }
          >
            <svg
              viewBox={
                svgViewBox
                  ? `${svgViewBox.x} ${svgViewBox.y} ${svgViewBox.width} ${svgViewBox.height}`
                  : "0 0 1000 620"
              }
              width="100%"
              height="100%"
              role="img"
              aria-label={`Mapa de ${circuit.name}`}
            >
              <polyline
                points={path}
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinejoin="round"
                strokeLinecap="round"
                opacity="0.18"
              />
              <polyline
                points={path}
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {markers.map((marker) => (
                <circle
                  key={`car-${marker.racingNumber}`}
                  cx={marker.x}
                  cy={marker.y}
                  r="9"
                  fill={marker.color}
                  stroke="#f8fafc"
                  strokeWidth="2"
                  opacity={marker.offTrack ? 0.4 : 1}
                />
              ))}
              {markers.map((marker) => (
                <text
                  key={`label-${marker.racingNumber}`}
                  x={marker.x + 12}
                  y={marker.y - 10}
                  fill="currentColor"
                  fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                  fontSize="18"
                  fontWeight="700"
                  opacity={marker.offTrack ? 0.45 : 1}
                >
                  {marker.code}
                </text>
              ))}
            </svg>
          </Box>
        </Box>
      )}
    </Box>
  );
}
