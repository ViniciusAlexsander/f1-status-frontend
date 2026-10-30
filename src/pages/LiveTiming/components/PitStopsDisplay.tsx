import type { DriverTimingItem } from "@/api/types/livetiming";
import { Badge, Box, Text } from "@chakra-ui/react";
import {
  DriverStatus,
  getDriverStatus,
} from "@/api/liveTimingFeatures";

export function PitStopsDisplay({ driver }: { driver: DriverTimingItem }) {
  const status = getDriverStatus(driver);

  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      gap="1.5"
      w="full"
    >
      {status && (
        <Badge
          colorPalette={
            status === DriverStatus.Retired || status === DriverStatus.Stopped
              ? "red"
              : status === DriverStatus.In
                ? "yellow"
                : "blue"
          }
          variant="subtle"
          fontSize="9px"
          whiteSpace="nowrap"
          aria-label={`Status do piloto: ${status}`}
        >
          {status}
        </Badge>
      )}
      {!status && (
        <Text as="span" color="fg.muted">
          {driver.NumberOfPitStops ?? 0}
        </Text>
      )}
    </Box>
  );
}
