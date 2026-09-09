import {
  Alert,
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Spinner,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useListRaces } from "@/hooks/useListRaces";
import { useSessionResults } from "@/hooks/useSessionResults";
import type { SessionResult } from "@/api/types/results";

export default function SessionDetails() {
  const { meetingsId, sessionId } = useParams();
  const { data: raceList, isLoading: isRaceLoading } = useListRaces();
  const race = raceList?.races.find((item) => item.id === meetingsId);
  const session = race?.schedule.find((item) => item.id === sessionId);
  const {
    data: results,
    isLoading: isResultsLoading,
    isError,
    error,
  } = useSessionResults(meetingsId, sessionId);

  if (isRaceLoading || isResultsLoading) {
    return (
      <Container maxW="5xl">
        <Stack align="center" gap="4" py="12">
          <Spinner size="lg" />
          <Text color="fg.muted">Carregando resultados...</Text>
        </Stack>
      </Container>
    );
  }

  if (!race || !session) {
    return (
      <Container maxW="5xl">
        <Stack gap="4">
          <Alert.Root status="warning">
            <Alert.Indicator />
            <Alert.Title>Sessão não encontrada.</Alert.Title>
          </Alert.Root>
          <Button asChild alignSelf="flex-start" variant="outline">
            <RouterLink to="/">Voltar</RouterLink>
          </Button>
        </Stack>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxW="5xl">
        <Stack gap="4">
          <Alert.Root status="error">
            <Alert.Indicator />
            <Alert.Title>
              {error instanceof Error
                ? error.message
                : "Resultados ainda não disponíveis."}
            </Alert.Title>
          </Alert.Root>
          <Button asChild alignSelf="flex-start" variant="outline">
            <RouterLink to={`/meetings/${race.id}`}>
              Voltar para a etapa
            </RouterLink>
          </Button>
        </Stack>
      </Container>
    );
  }

  const rows = results ?? [];
  const podium = rows.slice(0, 3);
  const hasGrid = rows.some((row) => row.gridPosition !== null);

  return (
    <Container maxW="5xl">
      <Stack gap="6" py={{ base: 2, md: 4 }}>
        <Button asChild alignSelf="flex-start" variant="outline">
          <RouterLink to={`/meetings/${race.id}`}>
            Voltar para {race.name}
          </RouterLink>
        </Button>

        <Stack gap="2">
          <Flex align="center" gap="3" wrap="wrap">
            <Heading size="xl">{session.name}</Heading>
            <Badge>{session.status}</Badge>
          </Flex>
          <Text color="fg.muted">
            {race.location.name} · {race.location.city}
          </Text>
        </Stack>

        {rows.length === 0 ? (
          <Alert.Root status="info">
            <Alert.Indicator />
            <Alert.Title>
              Resultado ainda não disponível para esta sessão.
            </Alert.Title>
          </Alert.Root>
        ) : (
          <>
            <ResultSummary rows={podium} />
            <StartingGrid rows={rows} visible={hasGrid} />
            <ResultsTable rows={rows} />
          </>
        )}
      </Stack>
    </Container>
  );
}

function ResultSummary({ rows }: { rows: SessionResult[] }) {
  return (
    <Box borderWidth="1px" borderColor="border" bg="card">
      <Heading
        px="4"
        py="3"
        borderBottomWidth="1px"
        borderColor="border"
        fontFamily="mono"
        fontSize="11px"
        letterSpacing="0.14em"
        textTransform="uppercase"
      >
        Resultado da sessão
      </Heading>
      <Flex divideX="1px" divideColor="border">
        {rows.map((row, index) => (
          <Box key={row.id} flex="1" minW="0" p="4" textAlign="center">
            <Text fontFamily="mono" fontSize="xs" color="fg.muted">
              {index + 1}º
            </Text>
            <Text mt="2" fontFamily="mono" fontWeight="600">
              {row.driver.code}
            </Text>
            <Text mt="1" truncate fontSize="xs" color="fg.muted">
              {row.team.shortName}
            </Text>
          </Box>
        ))}
      </Flex>
    </Box>
  );
}

function StartingGrid({
  rows,
  visible,
}: {
  rows: SessionResult[];
  visible: boolean;
}) {
  if (!visible) {
    return (
      <Alert.Root status="info">
        <Alert.Indicator />
        <Alert.Title>
          Grid de largada não disponível para esta sessão.
        </Alert.Title>
      </Alert.Root>
    );
  }

  const grid = [...rows].sort(
    (a, b) => (a.gridPosition ?? Infinity) - (b.gridPosition ?? Infinity),
  );
  return (
    <Box borderWidth="1px" borderColor="border" bg="card">
      <Heading
        px="4"
        py="3"
        borderBottomWidth="1px"
        borderColor="border"
        fontFamily="mono"
        fontSize="11px"
        letterSpacing="0.14em"
        textTransform="uppercase"
      >
        Grid de largada
      </Heading>
      <Stack gap="0" divideY="1px" divideColor="border">
        {grid.map((row) => (
          <Flex key={row.id} align="center" gap="3" px="4" py="2.5">
            <Text w="6" fontFamily="mono" fontSize="xs" color="fg.muted">
              {String(row.gridPosition).padStart(2, "0")}
            </Text>
            <Box h="5" w="3px" bg={row.team.color} />
            <Text flex="1" fontFamily="mono" fontSize="sm">
              {row.driver.code}
            </Text>
            <Text fontSize="xs" color="fg.muted">
              {row.team.shortName}
            </Text>
          </Flex>
        ))}
      </Stack>
    </Box>
  );
}

function ResultsTable({ rows }: { rows: SessionResult[] }) {
  return (
    <Box borderWidth="1px" borderColor="border" bg="card" overflowX="auto">
      <Heading
        px="4"
        py="3"
        borderBottomWidth="1px"
        borderColor="border"
        fontFamily="mono"
        fontSize="11px"
        letterSpacing="0.14em"
        textTransform="uppercase"
      >
        Classificação completa
      </Heading>
      <Table.Root size="sm" variant="outline" minW="42rem">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Pos</Table.ColumnHeader>
            <Table.ColumnHeader>Piloto</Table.ColumnHeader>
            <Table.ColumnHeader>Equipe</Table.ColumnHeader>
            <Table.ColumnHeader>Tempo/intervalo</Table.ColumnHeader>
            <Table.ColumnHeader>Voltas</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Pts</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((row) => (
            <Table.Row key={row.id}>
              <Table.Cell fontFamily="mono">{row.position}</Table.Cell>
              <Table.Cell>
                <Flex align="center" gap="2">
                  <Box h="4" w="3px" bg={row.team.color} />
                  <Text fontFamily="mono" fontWeight="600">
                    {row.driver.code}
                  </Text>
                  <Text color="fg.muted">
                    {row.driver.firstName} {row.driver.lastName}
                  </Text>
                </Flex>
              </Table.Cell>
              <Table.Cell color="fg.muted">{row.team.shortName}</Table.Cell>
              <Table.Cell fontFamily="mono">
                {row.displayTime ?? row.interval ?? "—"}
              </Table.Cell>
              <Table.Cell fontFamily="mono">{row.laps}</Table.Cell>
              <Table.Cell textAlign="end" fontFamily="mono">
                {row.points}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
