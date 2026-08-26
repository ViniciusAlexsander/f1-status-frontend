import { useDriversStandings } from "@/hooks/useDriversStandings";
import {
  Alert,
  Badge,
  Heading,
  Spinner,
  Stack,
  Stat,
  Text,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@chakra-ui/react";

export default function DriversStandings() {
  const { data: driversStandings, isLoading, isError } = useDriversStandings();

  if (isLoading) {
    return (
      <Stack align="center" gap="4">
        <Spinner size="lg" />
        <Text>Carregando classificação</Text>
      </Stack>
    );
  }

  if (isError) {
    return (
      <Alert.Root status="error">
        <Alert.Indicator />
        <Alert.Title>Erro ao carregar classificação</Alert.Title>
      </Alert.Root>
    );
  }

  return (
    <Stack
      gap="4"
      borderWidth="1px"
      borderColor="border"
      bg="card"
      p={{ base: 2, md: 4 }}
    >
      <Heading
        fontFamily="mono"
        fontSize="11px"
        letterSpacing="0.14em"
        textTransform="uppercase"
      >
        Pilotos
      </Heading>
      <Table.Root size="sm" variant="outline">
        <TableBody>
          {driversStandings &&
            driversStandings.map((driver) => (
              <TableRow key={driver.id}>
                <TableCell>
                  <Stack direction="row" align="center">
                    <Heading size="lg" minW={5}>
                      {driver.position}
                    </Heading>
                    <Badge bg={driver.teams[0].color} color="white" minW={8}>
                      {driver.code}
                    </Badge>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Text textStyle="sm" fontWeight="bold" minWidth={32}>
                    {driver.firstName} {driver.lastName}
                  </Text>
                  <Text textStyle="xs">{driver.teams[0].shortName}</Text>
                </TableCell>
                <TableCell>
                  <Stat.Root>
                    <Stat.ValueText>{driver.points}</Stat.ValueText>
                    <Stat.ValueUnit>pontos</Stat.ValueUnit>
                  </Stat.Root>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table.Root>
    </Stack>
  );
}
