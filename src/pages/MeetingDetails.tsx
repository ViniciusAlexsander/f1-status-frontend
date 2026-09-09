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
import { useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useListRaces } from "@/hooks/useListRaces";
import { useSessionResults } from "@/hooks/useSessionResults";
import type { SessionResult } from "@/api/types/results";
import type { RaceWeek, Schedule } from "@/api/types/race";
import { formatDate, formatDateTimeString } from "@/utils/date";

export default function MeetingDetails() {
  const { id } = useParams();
  const { data: raceList, isLoading, error } = useListRaces();

  if (isLoading) {
    return (
      <Container maxW="5xl">
        <Stack align="center" gap="4" py="12">
          <Spinner size="lg" />
          <Text color="fg.muted">Carregando fim de semana...</Text>
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="5xl">
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Title>{error.message}</Alert.Title>
        </Alert.Root>
      </Container>
    );
  }

  const event = raceList?.races.find((race) => race.id === id);
  if (!event) {
    return (
      <Container maxW="5xl">
        <Stack gap="4">
          <Alert.Root status="warning">
            <Alert.Indicator />
            <Alert.Title>Fim de semana não encontrado.</Alert.Title>
          </Alert.Root>
          <Button asChild alignSelf="flex-start" variant="outline">
            <RouterLink to="/">Voltar para a Home</RouterLink>
          </Button>
        </Stack>
      </Container>
    );
  }

  const eventIndex =
    raceList?.races.findIndex((race) => race.id === event.id) ?? -1;
  const previous = eventIndex > 0 ? raceList?.races[eventIndex - 1] : undefined;
  const next = raceList?.races[eventIndex + 1];

  return (
    <Container maxW="5xl">
      <Stack gap="6" py={{ base: 2, md: 4 }}>
        <WeekendOverview event={event} previous={previous} next={next} />
        <Stack gap="3">
          <Heading
            fontFamily="mono"
            fontSize="11px"
            letterSpacing="0.14em"
            textTransform="uppercase"
          >
            Agenda do fim de semana
          </Heading>
          {event.schedule.length === 0 ? (
            <Text color="fg.muted">
              Nenhuma sessão cadastrada para este fim de semana.
            </Text>
          ) : (
            <SessionTimeline raceId={event.id} sessions={event.schedule} />
          )}
        </Stack>
      </Stack>
    </Container>
  );
}

function SessionTimeline({
  raceId,
  sessions,
}: {
  raceId: string;
  sessions: Schedule[];
}) {
  const started = sessions.filter(
    (session) => session.status === "completed" || session.status === "ongoing",
  );
  const defaultSessionId =
    started[started.length - 1]?.id ??
    sessions.find((session) => session.status === "scheduled")?.id;
  const [expandedId, setExpandedId] = useState<string | undefined>(
    defaultSessionId,
  );

  return (
    <Stack gap="3">
      {sessions.map((session) => {
        const expanded = expandedId === session.id;
        return (
          <SessionSection
            key={session.id}
            raceId={raceId}
            session={session}
            expanded={expanded}
            onToggle={() => setExpandedId(expanded ? undefined : session.id)}
          />
        );
      })}
    </Stack>
  );
}

function WeekendOverview({
  event,
  previous,
  next,
}: {
  event: RaceWeek;
  previous?: RaceWeek;
  next?: RaceWeek;
}) {
  const isLive = event.status === "ongoing";
  return (
    <Box borderWidth="1px" borderColor={isLive ? "f1.500" : "border"} bg="card">
      <Flex
        align="center"
        justify="space-between"
        borderBottomWidth="1px"
        borderColor="border"
        px="4"
        py="2.5"
        gap="3"
      >
        <Text
          fontFamily="mono"
          fontSize="10px"
          letterSpacing="0.14em"
          color={isLive ? "f1.500" : "fg.muted"}
          textTransform="uppercase"
        >
          {isLive
            ? "Fim de semana ao vivo"
            : event.status === "completed"
              ? "Evento encerrado"
              : "Próximo evento"}
        </Text>
        <Text fontFamily="mono" fontSize="10px" color="fg.muted">
          {event.location.country.twoCode ?? event.location.country.name}
        </Text>
      </Flex>
      <Stack gap="5" p={{ base: 5, md: 7 }}>
        <Box>
          <Text
            fontFamily="mono"
            fontSize="xs"
            letterSpacing="0.12em"
            color="fg.muted"
            textTransform="uppercase"
          >
            {event.location.country.name} · {event.location.city}
          </Text>
          <Heading
            mt="2"
            fontSize={{ base: "3xl", md: "5xl" }}
            lineHeight="1.05"
          >
            {event.name}
          </Heading>
          <Stack
            mt="5"
            gap="2"
            fontFamily="mono"
            fontSize="xs"
            color="fg.muted"
          >
            <Text>{event.location.name}</Text>
            <Text>
              {formatDate(event.dateStart)} a {formatDate(event.dateEnd)}
            </Text>
          </Stack>
        </Box>
        <Flex gap="2" wrap="wrap">
          {previous && (
            <Button asChild variant="outline" size="sm">
              <RouterLink to={`/meetings/${previous.id}`}>
                ← Anterior
              </RouterLink>
            </Button>
          )}
          {next && (
            <Button asChild variant="outline" size="sm">
              <RouterLink to={`/meetings/${next.id}`}>Próximo →</RouterLink>
            </Button>
          )}
        </Flex>
      </Stack>
    </Box>
  );
}

function SessionSection({
  raceId,
  session,
  expanded,
  onToggle,
}: {
  raceId: string;
  session: Schedule;
  expanded: boolean;
  onToggle: () => void;
}) {
  const hasStarted =
    session.status === "completed" || session.status === "ongoing";
  const { data, isLoading, isError } = useSessionResults(
    raceId,
    session.id,
    hasStarted && expanded,
  );
  const isRace = session.type === "race";

  return (
    <Box
      id={`session-${session.id}`}
      borderWidth="1px"
      borderColor={session.status === "ongoing" ? "f1.500" : "border"}
      bg="card"
    >
      <Flex
        align={{ base: "flex-start", md: "center" }}
        justify="space-between"
        direction={{ base: "column", md: "row" }}
        gap="3"
        borderBottomWidth={expanded ? "1px" : 0}
        borderColor="border"
        px="4"
        py="3"
      >
        <Box>
          <Heading
            fontFamily="mono"
            fontSize="sm"
            letterSpacing="0.1em"
            textTransform="uppercase"
          >
            {session.name}
          </Heading>
          <Text mt="1" fontFamily="mono" fontSize="10px" color="fg.muted">
            {formatDateTimeString(session.startTime)} · até{" "}
            {formatDateTimeString(session.endTime)}
          </Text>
        </Box>
        <Flex gap="2">
          <Badge colorPalette={session.status === "ongoing" ? "f1" : "gray"}>
            {session.status}
          </Badge>
          <Badge variant="outline">{session.type}</Badge>
          <Button
            size="xs"
            variant="outline"
            aria-expanded={expanded}
            onClick={onToggle}
          >
            {expanded ? "Fechar" : "Ver resultado"}
          </Button>
        </Flex>
      </Flex>

      {!expanded ? null : !hasStarted ? (
        <Flex align="center" gap="3" px="4" py="5">
          <Text color="fg.muted">
            Resultado disponível após o início da sessão.
          </Text>
        </Flex>
      ) : isLoading ? (
        <Flex align="center" gap="3" px="4" py="5">
          <Spinner size="sm" />
          <Text color="fg.muted">Carregando resultado...</Text>
        </Flex>
      ) : isError ? (
        <Alert.Root status="info" borderRadius="0" borderWidth="0">
          <Alert.Indicator />
          <Alert.Title>
            Resultado ainda não disponível para esta sessão.
          </Alert.Title>
        </Alert.Root>
      ) : data && data.length > 0 ? (
        <SessionResultContent rows={data} isRace={isRace} />
      ) : (
        <Text px="4" py="5" color="fg.muted">
          Resultado ainda não disponível para esta sessão.
        </Text>
      )}
    </Box>
  );
}

function SessionResultContent({
  rows,
  isRace,
}: {
  rows: SessionResult[];
  isRace: boolean;
}) {
  const podium = rows.slice(0, 3);
  const grid = rows
    .filter((row) => row.gridPosition !== null)
    .sort(
      (a, b) => (a.gridPosition ?? Infinity) - (b.gridPosition ?? Infinity),
    );
  const fastest = rows.find((row) => row.fastestLap?.time);

  return (
    <Stack gap="0">
      <Flex
        divideX="1px"
        divideColor="border"
        borderBottomWidth="1px"
        borderColor="border"
      >
        {podium.map((row, index) => (
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
      {isRace && fastest?.fastestLap?.time && (
        <Text
          px="4"
          py="2.5"
          fontFamily="mono"
          fontSize="xs"
          color="f1.500"
          borderBottomWidth="1px"
          borderColor="border"
        >
          Melhor volta: {fastest.driver.code} · {fastest.fastestLap.time}
        </Text>
      )}
      {grid.length > 0 && <InlineGrid rows={grid} />}
      <Box overflowX="auto">
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
    </Stack>
  );
}

function InlineGrid({ rows }: { rows: SessionResult[] }) {
  return (
    <Box borderBottomWidth="1px" borderColor="border">
      <Text
        px="4"
        py="2.5"
        fontFamily="mono"
        fontSize="10px"
        letterSpacing="0.12em"
        color="fg.muted"
        textTransform="uppercase"
      >
        Grid de largada
      </Text>
      <Flex wrap="wrap" gap="1px" bg="border">
        {rows.map((row) => (
          <Flex
            key={row.id}
            align="center"
            gap="2"
            flex="1 1 15rem"
            minW="15rem"
            bg="card"
            px="4"
            py="2.5"
          >
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
      </Flex>
    </Box>
  );
}
