import type { DriverPenalty } from "@/api/types/livetiming";
import { Badge, Flex } from "@chakra-ui/react";

type DriverIndicatorsProps = {
  penalties: DriverPenalty[];
};

export function DriverIndicators({ penalties }: DriverIndicatorsProps) {
  if (penalties.length === 0) return null;

  return (
    <Flex flexShrink="0" align="center" gap="1">
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
