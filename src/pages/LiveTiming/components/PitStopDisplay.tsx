import type { DriverTimingItem } from "@/api/types/livetiming";
import { Box, Text } from "@chakra-ui/react";

type PitStopDisplayProps = {
  driver: DriverTimingItem;
};

export function PitStopDisplay({ driver }: PitStopDisplayProps) {
  const tyre = driver.currentTyre?.Compound;

  return (
    <Box as="span">
      {!driver.Stopped &&
        !driver.Retired &&
        !driver.InPit &&
        !driver.PitOut &&
        tyre?.abbreviation && (
          <>
            <Text as="span" color={tyre.color} fontWeight="700">
              {tyre.abbreviation}
            </Text>{" "}
            |{" "}
          </>
        )}
      {getPitStopText(driver)}
    </Box>
  );
}

function getPitStopText(driver: DriverTimingItem) {
  if (driver.Stopped || driver.Retired) return "Abandonou";
  if (driver.InPit) return "Em pit stop";
  if (driver.PitOut) return "Saindo do pit stop";
  if (driver.NumberOfPitStops) return `PIT ${driver.NumberOfPitStops}`;
  return "-";
}
