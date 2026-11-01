import type { DriverPenalty, DriverTimingItem } from "@/api/types/livetiming";
import { Badge, Box, Flex, Grid, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { DriverIndicators } from "./DriverIndicators";
import { PitStopsDisplay } from "./PitStopsDisplay";
import { TeamLogo } from "./TeamLogo";
import { TyreStintDisplay } from "./TyreStintDisplay";

const leaderboardColumns = {
  base: "22px 60px 30px 60px 50px 42px 60px 56px 42px 30px",
  md: "30px 64px repeat(8, minmax(0, 1fr))",
  xl: "36px 64px repeat(8, minmax(0, 1fr))",
};

type LiveTimingLeaderboardProps = {
  drivers: DriverTimingItem[];
  penaltiesByDriver: Map<string, DriverPenalty[]>;
};

export function LiveTimingLeaderboard({
  drivers,
  penaltiesByDriver,
}: LiveTimingLeaderboardProps) {
  return (
    <Box
      w="full"
      maxW="full"
      overflowX="auto"
      borderWidth="1px"
      borderColor="border"
      borderRadius="lg"
      overscrollBehaviorX="contain"
      css={{ scrollbarColor: "var(--chakra-colors-border) transparent" }}
    >
      <Box w="full" maxW="full">
        {drivers.length === 0 ? (
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
              O leaderboard será preenchido quando o servidor enviar dados ao
              vivo.
            </Text>
          </Box>
        ) : (
          <Box w="full" minW={{ base: "500px", md: "0" }}>
            <Grid
              templateColumns={leaderboardColumns}
              columnGap={{ base: 0.5, md: 2 }}
              rowGap="0"
              alignItems="center"
              position="sticky"
              top="0"
              zIndex="2"
              bg="bg.subtle"
              borderBottomWidth="1px"
              borderColor="border"
              px={{ base: 0.5, md: 2 }}
              py={{ base: 1, md: 2 }}
              fontFamily="mono"
              fontSize="9px"
              color="fg.muted"
              letterSpacing="0.08em"
              textTransform="uppercase"
            >
              <Text>Pos</Text>
              <Text>Piloto</Text>
              <Text textAlign="center" title="Ganho/perda de posições">
                G/P
              </Text>
              <Text textAlign="right">Melhor</Text>
              <Text textAlign="right">Gap</Text>
              <Text textAlign="right">Int</Text>
              <Text textAlign="right">Última</Text>
              <Text textAlign="center">Pits</Text>
              <Text textAlign="center">Pneu</Text>
              <Text textAlign="center">Laps</Text>
            </Grid>
            {drivers.map((driver, index) => (
              <Grid
                key={driver.id}
                templateColumns={leaderboardColumns}
                columnGap={{ base: 0.5, md: 2 }}
                rowGap="0"
                alignItems="center"
                minH={{ base: "34px", md: "42px" }}
                px={{ base: 0.5, md: 2 }}
                py={{ base: 0.5, md: 1 }}
                bg={index % 2 === 0 ? "card" : "bg.subtle"}
                borderBottomWidth="1px"
                borderColor="border"
                fontVariantNumeric="tabular-nums"
              >
                <Text fontFamily="mono" fontSize="sm" fontWeight="700">
                  {driver.Position ?? driver.RacingNumber ?? "—"}
                </Text>
                <Flex minW="0" align="center" gap="1">
                  {driver.driverData && (
                    <TeamLogo
                      teamName={driver.driverData.teams[0]?.shortName}
                    />
                  )}
                  <Badge
                    flexShrink="0"
                    bg={driver.driverData?.teams[0]?.color}
                    color={driver.driverData?.teams[0]?.textColor}
                    minW="6"
                    px="0.5"
                    fontSize="9px"
                  >
                    {driver.driverData?.code ?? driver.RacingNumber}
                  </Badge>
                  <DriverIndicators
                    penalties={
                      driver.RacingNumber
                        ? (penaltiesByDriver.get(driver.RacingNumber) ?? [])
                        : []
                    }
                  />
                </Flex>
                <PositionChange value={driver.positionChange} />
                <Cell
                  align="right"
                  color={driver.isFastestLap ? "fastest" : "fg"}
                >
                  {driver.BestLapTime?.Value ?? "—"}
                </Cell>
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
                <Cell align="center">{driver.NumberOfLaps ?? "—"}</Cell>
              </Grid>
            ))}
          </Box>
        )}
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
  if (value == null || value === 0) {
    return (
      <Text textAlign="center" color="fg.muted" fontFamily="mono" fontSize="xs">
        —
      </Text>
    );
  }
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
