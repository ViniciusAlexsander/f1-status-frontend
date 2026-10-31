import type { DriverPenalty, DriverTimingItem } from "@/api/types/livetiming";
import { Badge, Box, Flex, Grid, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { DriverIndicators, FastestLapClock } from "./DriverIndicators";
import { PitStopsDisplay } from "./PitStopsDisplay";
import { TeamLogo } from "./TeamLogo";
import { TyreStintDisplay } from "./TyreStintDisplay";

const leaderboardColumns = {
  base: "24px minmax(100px, 1.2fr) minmax(48px, 0.75fr) minmax(44px, 0.7fr) minmax(58px, 0.9fr) minmax(32px, 0.55fr) minmax(58px, 0.9fr) minmax(58px, 0.9fr) minmax(36px, 0.6fr)",
  md: "36px minmax(140px, 1.3fr) repeat(2, minmax(64px, 0.8fr)) minmax(70px, 1fr) 56px minmax(90px, 1.1fr) minmax(92px, 1.15fr) minmax(78px, 1fr)",
  xl: "44px minmax(180px, 1.5fr) repeat(2, minmax(80px, 0.8fr)) minmax(90px, 1fr) 64px minmax(110px, 1fr) repeat(2, minmax(90px, 1fr))",
};

type LiveTimingLeaderboardProps = {
  drivers: DriverTimingItem[];
  penaltiesByDriver: Map<string, DriverPenalty[]>;
};

export function LiveTimingLeaderboard({
  drivers,
  penaltiesByDriver,
}: LiveTimingLeaderboardProps) {
  if (drivers.length === 0) {
    return (
      <Box
        borderWidth="1px"
        borderColor="border"
        borderRadius="lg"
        bg="card"
        textAlign="center"
        px="5"
        py="14"
      >
        <Text fontFamily="mono" fontSize="sm" textTransform="uppercase">
          Nenhuma transmissão disponível
        </Text>
        <Text mt="2" fontSize="sm" color="fg.muted">
          O leaderboard será preenchido quando o servidor enviar dados ao vivo.
        </Text>
      </Box>
    );
  }

  return (
    <Box
      w="full"
      overflowX="auto"
      borderWidth="1px"
      borderColor="border"
      borderRadius="lg"
      overscrollBehaviorX="contain"
      css={{ scrollbarColor: "var(--chakra-colors-border) transparent" }}
    >
      <Box
        minW={{ base: "520px", md: "750px", xl: "0" }}
        w={{ base: "max(100%, 520px)", md: "max(100%, 750px)", xl: "full" }}
      >
        <Grid
          templateColumns={leaderboardColumns}
          gap={{ base: 0.5, md: 1, xl: 2 }}
          columnGap={{ base: 1, md: 1, xl: 2 }}
          alignItems="center"
          position="sticky"
          top="0"
          zIndex="2"
          bg="bg.subtle"
          borderBottomWidth="1px"
          borderColor="border"
          px={{ base: 1, md: 3 }}
          py={{ base: 1.5, md: 3 }}
          fontFamily="mono"
          fontSize="9px"
          color="fg.muted"
          letterSpacing="0.08em"
          textTransform="uppercase"
        >
          <Text>Pos</Text>
          <Text>Piloto</Text>
          <Text textAlign="right">Gap</Text>
          <Text textAlign="right">
            <Text as="span" display={{ base: "none", xl: "inline" }}>
              Intervalo
            </Text>
            <Text as="span" display={{ base: "inline", xl: "none" }}>
              Int
            </Text>
          </Text>
          <Text textAlign="right">
            <Text as="span" display={{ base: "none", xl: "inline" }}>
              Última
            </Text>
            <Text as="span" display={{ base: "inline", xl: "none" }}>
              Últ.
            </Text>
          </Text>
          <Text textAlign="center">Pits</Text>
          <Text textAlign="center">Pneu</Text>
          <Text textAlign="right">Melhor</Text>
          <Text textAlign="center">Laps</Text>
        </Grid>
        {drivers.map((driver, index) => (
          <Grid
            key={driver.id}
            templateColumns={leaderboardColumns}
            gap={{ base: 0.5, md: 1, xl: 2 }}
            columnGap={{ base: 1, md: 1, xl: 2 }}
            alignItems="center"
            minH={{ base: "42px", md: "56px" }}
            px={{ base: 1, md: 3 }}
            py={{ base: 1, md: 2 }}
            bg={index % 2 === 0 ? "card" : "bg.subtle"}
            borderBottomWidth="1px"
            borderColor="border"
            fontVariantNumeric="tabular-nums"
          >
            <Text fontFamily="mono" fontSize="sm" fontWeight="700">
              {driver.Position ?? driver.RacingNumber ?? "—"}
            </Text>
            <Flex minW="0" align="center" gap={{ base: 1.5, md: 2 }}>
              {driver.driverData && (
                <TeamLogo teamName={driver.driverData.teams[0]?.shortName} />
              )}
              <Badge
                flexShrink="0"
                bg={driver.driverData?.teams[0]?.color}
                color={driver.driverData?.teams[0]?.textColor}
                minW={{ base: "7", md: "9" }}
                px={{ base: 1, md: 2 }}
                fontSize={{ base: "10px", md: "xs" }}
              >
                {driver.driverData?.code ?? driver.RacingNumber}
              </Badge>
              <Text
                display={{ base: "none", lg: "block" }}
                minW="0"
                truncate
                fontSize="xs"
                fontWeight="600"
              >
                {driver.driverData
                  ? `${driver.driverData.firstName} ${driver.driverData.lastName}`
                  : "Piloto sem cadastro"}
              </Text>
              <PositionChange value={driver.positionChange} />
              {driver.isFastestLap && (
                <Box
                  display={{ base: "flex", lg: "none" }}
                  flexShrink="0"
                  alignItems="center"
                >
                  <FastestLapClock driver={driver} size={16} />
                </Box>
              )}
              <DriverIndicators
                driver={driver}
                penalties={
                  driver.RacingNumber
                    ? (penaltiesByDriver.get(driver.RacingNumber) ?? [])
                    : []
                }
              />
            </Flex>
            <Box minW="0">
              <Cell align="right">
                {driver.GapToLeader ?? (index === 0 ? "LÍDER" : "—")}
              </Cell>
            </Box>
            <Cell align="right">
              {driver.IntervalToPositionAhead?.Value ??
                driver.TimeDiffToPositionAhead ??
                "—"}
            </Cell>
            <Cell
              align="right"
              color={
                driver.LastLapTime?.PersonalFastest ? "personalBest" : "fg"
              }
            >
              {driver.LastLapTime?.Value ?? "—"}
            </Cell>
            <Cell align="center">
              <PitStopsDisplay driver={driver} />
            </Cell>
            <Cell align="center">
              <TyreStintDisplay driver={driver} />
            </Cell>
            <Cell align="right" color={driver.isFastestLap ? "fastest" : "fg"}>
              {driver.BestLapTime?.Value ?? "—"}
            </Cell>
            <Cell align="center">{driver.NumberOfLaps ?? "—"}</Cell>
          </Grid>
        ))}
      </Box>
    </Box>
  );
}

function Cell({
  children,
  align = "left",
  color = "fg.muted",
}: {
  children: ReactNode;
  align?: "left" | "right" | "center";
  color?: string;
}) {
  return (
    <Text
      minW="0"
      textAlign={align}
      color={color}
      fontFamily="mono"
      fontSize="xs"
      truncate
    >
      {children}
    </Text>
  );
}

function PositionChange({ value }: { value?: number }) {
  if (value == null || value === 0) return null;
  const gained = value > 0;
  const Icon = gained ? RiArrowUpSLine : RiArrowDownSLine;
  return (
    <Flex
      align="center"
      justify="center"
      gap="0.5"
      color={gained ? "green.400" : "red.400"}
      fontFamily="mono"
      fontSize="xs"
      fontWeight="700"
    >
      <Icon aria-hidden="true" />
      {Math.abs(value)}
    </Flex>
  );
}
