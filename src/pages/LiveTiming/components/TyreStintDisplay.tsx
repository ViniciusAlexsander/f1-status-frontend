import type { DriverTimingItem } from "@/api/types/livetiming";
import { Box, Text } from "@chakra-ui/react";
import softTyre from "@/assets/soft.svg";
import mediumTyre from "@/assets/medium.svg";
import hardTyre from "@/assets/hard.svg";

const TYRE_IMAGES: Record<string, string> = {
  soft: softTyre,
  medium: mediumTyre,
  hard: hardTyre,
};

export function TyreStintDisplay({ driver }: { driver: DriverTimingItem }) {
  const tyre = driver.currentTyre?.Compound;
  const tyreImage = tyre ? TYRE_IMAGES[tyre.label.toLowerCase()] : undefined;

  return (
    <Box as="span" display="inline-flex" alignItems="center" gap="1.5">
      {tyreImage ? (
        <img
          src={tyreImage}
          alt={`${tyre?.label} tyre`}
          title={tyre?.label}
          style={{
            width: "18px",
            height: "18px",
            objectFit: "contain",
            flexShrink: 0,
          }}
        />
      ) : tyre?.abbreviation ? (
        <Text as="span" color={tyre.color} fontWeight="700">
          {tyre.abbreviation}
        </Text>
      ) : null}
      {driver.currentStintLaps != null && (
        <Text
          as="span"
          color={tyre?.color ? tyre.color : "fg.muted"}
          fontSize="xs"
          fontWeight="bold"
        >
          {driver.currentStintLaps}
        </Text>
      )}
    </Box>
  );
}
