import { type DriverTimingItem } from "@/api/types/livetiming";
import { useDriversLiveTimingData } from "@/hooks/useDriversLiveTimingData";
import {
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

  return (
    <Container maxW="5xl">
      <Stack gap="6">
        <Heading size="3xl">Live Timing</Heading>
        <Stack gap="4" alignItems="center">
          <Table.ScrollArea borderWidth="1px" maxW="xl">
            <Table.Root size="sm" variant="outline">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader minW={{ base: "100px", md: "auto" }}>
                    Posição
                  </Table.ColumnHeader>
                  <Table.ColumnHeader minW={{ base: "100px", md: "auto" }}>
                    Piloto
                  </Table.ColumnHeader>
                  <Table.ColumnHeader minW={{ base: "100px", md: "auto" }}>
                    Tempo de volta
                  </Table.ColumnHeader>
                  <Table.ColumnHeader minW={{ base: "100px", md: "auto" }}>
                    Gap
                  </Table.ColumnHeader>
                  <Table.ColumnHeader minW={{ base: "100px", md: "auto" }}>
                    Voltas
                  </Table.ColumnHeader>
                  <Table.ColumnHeader minW={{ base: "100px", md: "auto" }}>
                    Pit Stops
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <TableBody>
                {drivers.map((driver) => (
                  <TableRow key={driver.id}>
                    <TableCell>{driver.Position}</TableCell>
                    <TableCell>{driver.RacingNumber}</TableCell>
                    <TableCell>
                      {driver.LastLapTime ? driver.LastLapTime.Value : ""}
                    </TableCell>
                    <TableCell>
                      {driver.TimeDiffToPositionAhead || ""}
                    </TableCell>
                    <TableCell>{driver.NumberOfLaps || ""}</TableCell>
                    <TableCell>{pitStopText(driver)}</TableCell>
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
  if (driver.InPit) return "Em pit stop";
  if (driver.PitOut) return "Saindo do pit stop";
  return driver.NumberOfPitStops;
};
