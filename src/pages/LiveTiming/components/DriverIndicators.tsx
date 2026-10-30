import type { DriverPenalty, DriverTimingItem } from "@/api/types/livetiming";
import { Badge, Box, Flex } from "@chakra-ui/react";
import { RiTimeLine } from "react-icons/ri";

type DriverIndicatorsProps = {
  driver: DriverTimingItem;
  penalties: DriverPenalty[];
};

export function DriverIndicators({ driver, penalties }: DriverIndicatorsProps) {
  if (!driver.isFastestLap && penalties.length === 0) return null;

  return (
    <Flex flexShrink="0" align="center" gap="1">
      {driver.isFastestLap && (
        <Box display={{ base: "none", lg: "flex" }} ml="1.5">
          <FastestLapClock driver={driver} />
        </Box>
      )}
      {penalties.map((penalty) => (
        <Badge
          key={penalty.id}
          colorPalette="red"
          title={penalty.message}
          aria-label={`Punição pendente para o carro ${penalty.racingNumber}`}
        >
          {penalty.seconds != null ? `${penalty.seconds}s` : "Punição"}
        </Badge>
      ))}
    </Flex>
  );
}

export function FastestLapClock({
  driver,
  size = 16,
}: {
  driver: DriverTimingItem;
  size?: number;
}) {
  return (
    <RiTimeLine
      color="#A855F7"
      size={size}
      title={`Volta mais rápida: ${driver.BestLapTime?.Value ?? ""}`}
      aria-label={`Volta mais rápida na volta ${driver.BestLapTime?.Lap ?? "desconhecida"}`}
      role="img"
    />
  );
}
