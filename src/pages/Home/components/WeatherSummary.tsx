import { Box, Flex, Text } from "@chakra-ui/react";
import { RiDropLine, RiWindyLine } from "react-icons/ri";
import type { WeatherSnapshot } from "@/utils/weather";
import {
  formatForecastDayLabel,
  formatWeatherPrecip,
  formatWeatherTemps,
  formatWeatherWind,
  getWeatherIcon,
  getWeatherIconColor,
} from "@/utils/weather";

type WeatherSummaryProps = {
  weather: WeatherSnapshot;
  compact?: boolean;
};

export function WeatherSummary({ weather, compact = false }: WeatherSummaryProps) {
  const WeatherIcon = getWeatherIcon(weather.weather_code);
  const iconColor = getWeatherIconColor(weather.weather_code);
  const iconSize = compact ? "16px" : "18px";
  const metaIconSize = compact ? "13px" : "14px";
  const fontSize = compact ? "xs" : "sm";

  return (
    <Flex
      align="center"
      gap={{ base: 2, md: 2.5 }}
      wrap="wrap"
      minW="0"
      fontFamily="mono"
      fontSize={fontSize}
      fontVariantNumeric="tabular-nums"
    >
      <Flex align="center" gap="1.5" minW="0">
        <Box fontSize={iconSize} lineHeight="1" flexShrink={0} aria-hidden="true">
          <WeatherIcon color={iconColor} />
        </Box>
        <Text fontWeight="600">{formatWeatherTemps(weather)}</Text>
      </Flex>
      <Flex align="center" gap="1">
        <Box fontSize={metaIconSize} lineHeight="1" flexShrink={0} aria-hidden="true">
          <RiDropLine color="#3B82F6" />
        </Box>
        <Text color="fg">{formatWeatherPrecip(weather)}</Text>
      </Flex>
      <Flex align="center" gap="1" minW="0">
        <Box fontSize={metaIconSize} lineHeight="1" flexShrink={0} aria-hidden="true">
          <RiWindyLine color="#94A3B8" />
        </Box>
        <Text color="fg" truncate>
          {formatWeatherWind(weather)}
        </Text>
      </Flex>
    </Flex>
  );
}

type ForecastDayRowProps = {
  date: string;
  weather: WeatherSnapshot;
};

export function ForecastDayRow({ date, weather }: ForecastDayRowProps) {
  const WeatherIcon = getWeatherIcon(weather.weather_code);
  const iconColor = getWeatherIconColor(weather.weather_code);

  return (
    <Flex
      align="center"
      justify="space-between"
      gap="3"
      wrap="wrap"
      py="2"
      borderTopWidth="1px"
      borderColor="border"
      _first={{ borderTopWidth: 0, pt: 0 }}
      fontFamily="mono"
      fontVariantNumeric="tabular-nums"
    >
      <Flex align="center" gap="3" minW="0">
        <Text
          w="2.25rem"
          flexShrink={0}
          fontSize="xs"
          fontWeight="600"
          letterSpacing="0.06em"
          color="fg.muted"
        >
          {formatForecastDayLabel(date)}
        </Text>
        <Box fontSize="18px" lineHeight="1" flexShrink={0} aria-hidden="true">
          <WeatherIcon color={iconColor} />
        </Box>
        <Text fontSize="sm" fontWeight="600">
          {formatWeatherTemps(weather)}
        </Text>
      </Flex>
      <Flex align="center" gap="2" flexShrink={0}>
        <Flex align="center" gap="1">
          <Box fontSize="14px" lineHeight="1" aria-hidden="true">
            <RiWindyLine color="#94A3B8" />
          </Box>
          <Text fontSize="xs" fontWeight="600">
            {formatWeatherWind(weather)}
          </Text>
        </Flex>
        <Flex align="center" gap="1">
          <Box fontSize="14px" lineHeight="1" aria-hidden="true">
            <RiDropLine color="#3B82F6" />
          </Box>
          <Text fontSize="sm" fontWeight="600">
            {formatWeatherPrecip(weather)}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
