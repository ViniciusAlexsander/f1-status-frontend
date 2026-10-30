import type { WeatherDataPayload } from "@/api/types/livetiming";
import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import {
  RiDashboardLine,
  RiDropLine,
  RiRainyLine,
  RiSunLine,
  RiTempHotLine,
  RiWindyLine,
} from "react-icons/ri";
import type { ReactNode } from "react";
import { TrackIcon } from "./TrackIcon";

type WeatherStripProps = {
  weather?: WeatherDataPayload;
};

export function WeatherStrip({ weather }: WeatherStripProps) {
  if (!weather) return null;

  const value = (item: number | undefined, suffix: string) =>
    item == null ? "—" : `${item}${suffix}`;

  const metrics = (
    <SimpleGrid
      columns={{ base: 3, sm: 3, xl: 6 }}
      gap={{ base: 1, md: 2 }}
      maxW={{ base: "full", xl: "720px" }}
      w="full"
      aria-label="Condições da pista"
    >
      <WeatherValue
        icon={<RiTempHotLine color="#F97316" />}
        label="Ar"
        value={value(weather.AirTemp, " °C")}
      />
      <WeatherValue
        icon={<TrackIcon style={{ color: "#F97316" }} />}
        label="Pista"
        value={value(weather.TrackTemp, " °C")}
      />
      <WeatherValue
        icon={
          weather.Rainfall && weather.Rainfall > 0 ? (
            <RiRainyLine color="#3B82F6" />
          ) : (
            <RiSunLine color="#FACC15" />
          )
        }
        label="Chuva"
        value={value(weather.Rainfall, " mm")}
      />
      <WeatherValue
        icon={<RiDropLine color="#3B82F6" />}
        label="Umidade"
        value={value(weather.Humidity, "%")}
      />
      <WeatherValue
        icon={<RiWindyLine color="#CBD5E1" />}
        label="Vento"
        value={
          weather.WindSpeed == null
            ? "—"
            : `${weather.WindSpeed} m/s${weather.WindDirection == null ? "" : ` · ${weather.WindDirection}°`}`
        }
      />
      <WeatherValue
        icon={<RiDashboardLine color="#A855F7" />}
        label="Pressão"
        value={value(weather.Pressure, " hPa")}
      />
    </SimpleGrid>
  );
  return metrics;
}

function WeatherValue({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Flex
      minW="0"
      direction="column"
      align="stretch"
      gap={{ base: 0.5, md: 1.5 }}
      borderWidth="1px"
      borderColor="border"
      borderRadius="md"
      bg="bg.subtle"
      px={{ base: 1, md: 2 }}
      py={{ base: 1, md: 1.5 }}
    >
      <Flex align="center" gap="1" color="fg.muted">
        <Box fontSize="sm" aria-hidden="true">
          {icon}
        </Box>
        <Text
          fontFamily="mono"
          fontSize="9px"
          letterSpacing="0.04em"
          textTransform="uppercase"
          truncate
        >
          {label}
        </Text>
      </Flex>
      <Text
        fontFamily="mono"
        fontSize={{ base: "xs", md: "sm" }}
        fontWeight="600"
        fontVariantNumeric="tabular-nums"
        truncate
      >
        {value}
      </Text>
    </Flex>
  );
}
