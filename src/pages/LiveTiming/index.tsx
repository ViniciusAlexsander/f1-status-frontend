import { type DriverTimingItem } from "@/api/types/livetiming";
import { useDriversLiveTimingData } from "@/hooks/useDriversLiveTimingData";
import { useSessionLiveTimingData } from "@/hooks/useSessionLiveTimingData";
import { useListRaces } from "@/hooks/useListRaces";
import {
  Badge,
  Box,
  Container,
  Flex,
  Grid,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";

export default function LiveTiming() {
  const { drivers } = useDriversLiveTimingData();
  const { session } = useSessionLiveTimingData();
  const { data: raceData } = useListRaces();
  const hasLiveData = drivers.length > 0 || Boolean(session);
  const sessionName = raceData?.currentRace?.name ?? "Sessão atual";

  return (
    <Container maxW="1600px" px={{ base: 4, md: 6 }}>
      <Stack gap="6" pt={{ base: 4, md: 6 }}>
        <Stack
          gap="0"
          w="full"
          borderWidth="1px"
          borderColor="border"
          bg="card"
        >
          <Flex
            align="center"
            justify="space-between"
            gap="4"
            borderBottomWidth="1px"
            borderColor="border"
            px={{ base: 4, md: 7 }}
            py="3"
          >
            <Flex align="center" gap="3">
              <Box w="1.5" h="6" bg="f1.500" />
              <Text
                fontFamily="mono"
                fontSize="11px"
                letterSpacing="0.14em"
                textTransform="uppercase"
              >
                Ao vivo · {sessionName}
              </Text>
            </Flex>
            <Badge colorPalette={hasLiveData ? "f1" : "gray"} variant="outline">
              {hasLiveData ? "AO VIVO" : "AGUARDANDO CONEXÃO"}
            </Badge>
          </Flex>
          {session && (
            <Box
              borderBottomWidth="1px"
              borderColor="border"
              px={{ base: 4, md: 5 }}
              py="3"
            >
              <Flex align="center" justify="space-between" gap="4" wrap="wrap">
                <Flex align="center" gap="2.5">
                  <Box
                    w="2.5"
                    h="2.5"
                    borderRadius="full"
                    bg="f1.500"
                    className="live-dot"
                  />
                  <Text
                    fontFamily="mono"
                    fontSize="sm"
                    letterSpacing="0.1em"
                    textTransform="uppercase"
                  >
                    Sessão ao vivo
                  </Text>
                </Flex>
                <Flex
                  gap={{ base: 3, md: 5 }}
                  fontFamily="mono"
                  fontSize="11px"
                  color="fg.muted"
                  textTransform="uppercase"
                >
                  <Text color="fg">Volta {session.lap}</Text>
                  <Text>{statusTrackText(session.trackStatus)}</Text>
                  <Text>{session.sessionStatus}</Text>
                </Flex>
              </Flex>
            </Box>
          )}
          {!hasLiveData && (
            <Box px="5" py="14" textAlign="center">
              <Text fontFamily="mono" fontSize="sm" textTransform="uppercase">
                Nenhuma transmissão disponível
              </Text>
              <Text mt="2" fontSize="sm" color="fg.muted">
                A tabela será preenchida quando o servidor enviar a sessão ao
                vivo.
              </Text>
            </Box>
          )}
          {hasLiveData && (
            <>
              <Stack
                display={{ base: "flex", md: "none" }}
                gap="0"
                m="2"
                divideY="1px"
                divideColor="border"
              >
                {drivers.map((driver, index) => (
                  <Box
                    key={driver.id}
                    bg={index % 2 === 0 ? "card" : "bg.subtle"}
                    px="2.5"
                    py="2"
                  >
                    <Flex align="center" gap="2">
                      <Text
                        w="6"
                        flexShrink="0"
                        fontFamily="mono"
                        fontSize="sm"
                        fontWeight="600"
                        fontVariantNumeric="tabular-nums"
                      >
                        {driver.Position ?? driver.RacingNumber ?? "-"}
                      </Text>
                      <Box
                        w="1"
                        h="5"
                        flexShrink="0"
                        bg={driver.driverData?.teams[0]?.color ?? "fg.muted"}
                      />
                      {driver.driverData ? (
                        <Badge
                          flexShrink="0"
                          bg={driver.driverData.teams[0].color}
                          color="white"
                          minW="8"
                          px="1.5"
                        >
                          {driver.driverData.code}
                        </Badge>
                      ) : (
                        <Badge flexShrink="0" colorPalette="gray" minW="8">
                          {driver.RacingNumber ?? "-"}
                        </Badge>
                      )}
                      <Text minW="0" flex="1" truncate fontSize="sm">
                        {driver.driverData
                          ? `${driver.driverData.firstName} ${driver.driverData.lastName}`
                          : "Piloto sem cadastro"}
                      </Text>
                      <Text
                        flexShrink="0"
                        fontFamily="mono"
                        fontSize="xs"
                        fontWeight="600"
                        fontVariantNumeric="tabular-nums"
                      >
                        {driver.IntervalToPositionAhead?.Value ??
                          driver.GapToLeader ??
                          "-"}
                      </Text>
                    </Flex>
                    <Grid
                      templateColumns="repeat(3, minmax(0, 1fr))"
                      gap="2"
                      pl="8"
                      pt="1.5"
                      fontFamily="mono"
                      fontSize="10px"
                      color="fg.muted"
                      fontVariantNumeric="tabular-nums"
                    >
                      <Text truncate>
                        <Text as="span" color="fg.muted">
                          BEST{" "}
                        </Text>
                        {driver.BestLapTime?.Value ?? "-"}
                      </Text>
                      <Text truncate>
                        <Text as="span" color="fg.muted">
                          LAP{" "}
                        </Text>
                        {driver.LastLapTime?.Value ?? "-"}
                      </Text>
                      <Text truncate textAlign="right">
                        <Text as="span" color="fg.muted">
                          PIT{" "}
                        </Text>
                        {pitStopText(driver)}
                      </Text>
                    </Grid>
                  </Box>
                ))}
              </Stack>
              <Box
                display={{ base: "none", md: "block" }}
                mt="2"
                borderTopWidth="2px"
                borderColor="f1.500"
                p={{ base: 2, md: 3 }}
              >
                <Grid
                  templateColumns={{
                    md: "2.5rem minmax(10rem, 1fr) 5.5rem 5.5rem 5.5rem 5.5rem 3.5rem",
                    xl: "3rem minmax(16rem, 1fr) 7rem 7rem 7rem 7rem 4rem",
                  }}
                  alignItems="center"
                  gap="2"
                  borderBottomWidth="1px"
                  borderColor="border"
                  px="2"
                  py="1.5"
                  fontFamily="mono"
                  fontSize="10px"
                  letterSpacing="0.1em"
                  color="fg.muted"
                  textTransform="uppercase"
                >
                  <Text>Pos</Text>
                  <Text>Piloto</Text>
                  <Text textAlign="right">Líder</Text>
                  <Text textAlign="right">Interv</Text>
                  <Text textAlign="right">Última</Text>
                  <Text textAlign="right">Melhor</Text>
                  <Text textAlign="center">Pit</Text>
                </Grid>
                <SimpleGrid columns={1} gap="1px" bg="border">
                  {drivers.map((driver, index) => (
                    <Grid
                      key={driver.id}
                      templateColumns={{
                        md: "2.5rem minmax(10rem, 1fr) 5.5rem 5.5rem 5.5rem 5.5rem 3.5rem",
                        xl: "3rem minmax(16rem, 1fr) 7rem 7rem 7rem 7rem 4rem",
                      }}
                      alignItems="center"
                      gap="2"
                      bg={index % 2 === 0 ? "card" : "bg.subtle"}
                      px="2"
                      py="2"
                      lineHeight="1"
                    >
                      <Text
                        fontFamily="mono"
                        fontSize="sm"
                        fontWeight="600"
                        fontVariantNumeric="tabular-nums"
                      >
                        {driver.Position ?? driver.RacingNumber ?? "-"}
                      </Text>
                      <Flex minW="0" align="center" gap="2">
                        <Box
                          w="1"
                          h="5"
                          flexShrink="0"
                          bg={driver.driverData?.teams[0]?.color ?? "fg.muted"}
                        />
                        {driver.driverData ? (
                          <Badge
                            flexShrink="0"
                            bg={driver.driverData.teams[0].color}
                            color="white"
                            minW="9"
                          >
                            {driver.driverData.code}
                          </Badge>
                        ) : (
                          <Badge flexShrink="0" colorPalette="gray" minW="9">
                            {driver.RacingNumber ?? "-"}
                          </Badge>
                        )}
                        <Flex minW="0" align="baseline" gap="1">
                          <Text truncate fontSize="xs" fontWeight="600">
                            {driver.driverData
                              ? `${driver.driverData.firstName} ${driver.driverData.lastName}`
                              : "Piloto sem cadastro"}
                          </Text>
                          <Text
                            truncate
                            fontFamily="mono"
                            fontSize="9px"
                            color="fg.muted"
                            textTransform="uppercase"
                          >
                            {driver.driverData?.teams[0]?.shortName ??
                              "Sem equipe"}
                          </Text>
                        </Flex>
                      </Flex>
                      <Text
                        textAlign="right"
                        fontFamily="mono"
                        fontSize="sm"
                        color="fg.muted"
                        fontVariantNumeric="tabular-nums"
                      >
                        {driver.GapToLeader ?? (index === 0 ? "LÍDER" : "-")}
                      </Text>
                      <Text
                        textAlign="right"
                        fontFamily="mono"
                        fontSize="sm"
                        color="fg.muted"
                        fontVariantNumeric="tabular-nums"
                      >
                        {driver.IntervalToPositionAhead?.Value ??
                          driver.TimeDiffToPositionAhead ??
                          "-"}
                      </Text>
                      <Text
                        textAlign="right"
                        fontFamily="mono"
                        fontSize="sm"
                        color={
                          driver.LastLapTime?.PersonalFastest
                            ? "personalBest"
                            : "fg.muted"
                        }
                        fontVariantNumeric="tabular-nums"
                      >
                        {driver.LastLapTime?.Value ?? "-"}
                      </Text>
                      <Text
                        textAlign="right"
                        fontFamily="mono"
                        fontSize="sm"
                        color={driver.BestLapTime?.Value ? "fg" : "fg.muted"}
                        fontVariantNumeric="tabular-nums"
                      >
                        {driver.BestLapTime?.Value ?? "-"}
                      </Text>
                      <Text
                        textAlign="center"
                        fontFamily="mono"
                        fontSize="sm"
                        color={
                          driver.InPit || driver.PitOut ? "f1.500" : "fg.muted"
                        }
                      >
                        {pitStopText(driver)}
                      </Text>
                    </Grid>
                  ))}
                </SimpleGrid>
              </Box>
            </>
          )}
        </Stack>
      </Stack>
    </Container>
  );
}

const pitStopText = (driver: DriverTimingItem) => {
  if (driver.Stopped) return "Abandonou";
  if (driver.Retired) return "Abandonou";
  if (driver.InPit) return "Em pit stop";
  if (driver.PitOut) return "Saindo do pit stop";
  if (driver.NumberOfPitStops) return driver.NumberOfPitStops;
  return "-";
};

const statusTrackText = (status: string) => {
  if (status === "AllClear") return "Pista liberada";
  if (status === "VSCEnding") return "Virtual safety car terminando";
  else return status;
};
