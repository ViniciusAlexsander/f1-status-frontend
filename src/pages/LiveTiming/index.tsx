import { type DriverTimingItem } from "@/api/types/livetiming";
import { useDriversLiveTimingData } from "@/hooks/useDriversLiveTimingData";
import { useSessionLiveTimingData } from "@/hooks/useSessionLiveTimingData";
import {
  Badge,
  Container,
  Heading,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@chakra-ui/react";

export default function LiveTiming() {
  const { drivers } = useDriversLiveTimingData();
  const { session } = useSessionLiveTimingData();

  return (
    <Container maxW="5xl">
      <Stack gap="6">
        <Heading size="3xl">Live Timing</Heading>
        <Stack gap="4" w="full">
          {session && (
            <Stack alignItems="center" justifyContent="center" direction="row">
              <Heading size={{ base: "md", md: "xl" }}>
                Lap: {session.lap}
              </Heading>
              <Heading> </Heading>
            </Stack>
          )}
          <Table.ScrollArea borderWidth="1px" w="full" maxW="full">
            <Table.Root
              size="sm"
              variant="outline"
              minW={{ base: "auto", md: "auto" }}
            >
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader minW={{ base: "50px", md: "auto" }}>
                    Posição
                  </Table.ColumnHeader>
                  <Table.ColumnHeader minW={{ base: "50px", md: "auto" }}>
                    Gap
                  </Table.ColumnHeader>
                  <Table.ColumnHeader minW={{ base: "50px", md: "auto" }}>
                    Best Time
                  </Table.ColumnHeader>
                  <Table.ColumnHeader minW={{ base: "50px", md: "auto" }}>
                    Lap Time
                  </Table.ColumnHeader>
                  <Table.ColumnHeader minW={{ base: "100px", md: "auto" }}>
                    Pit Stops
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <TableBody>
                {drivers.map((driver, index) => (
                  <TableRow
                    key={driver.id}
                    backgroundColor={
                      index % 2 === 0 ? "blackAlpha.950" : "gray.800"
                    }
                  >
                    <TableCell whiteSpace="nowrap">
                      {driver.Position} {" | "}
                      {driver.driverData ? (
                        <Badge
                          color={driver.driverData.teams[0].color}
                          minW={8}
                        >
                          {driver.driverData.code}
                        </Badge>
                      ) : (
                        driver.RacingNumber
                      )}
                    </TableCell>
                    <TableCell whiteSpace="nowrap">
                      {driver.TimeDiffToPositionAhead || "-"}
                    </TableCell>
                    <TableCell whiteSpace="nowrap">
                      {driver.BestLapTime ? driver.BestLapTime.Value : "-"}
                    </TableCell>
                    <TableCell whiteSpace="nowrap">
                      {driver.LastLapTime ? driver.LastLapTime.Value : "-"}
                    </TableCell>
                    <TableCell whiteSpace="nowrap">
                      {pitStopText(driver)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table.Root>
          </Table.ScrollArea>
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
