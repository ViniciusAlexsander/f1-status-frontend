import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Heading,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useFormula1Events } from "../api/useFormula1Events";
import type { Formula1Event } from "../api/types";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getNextEvent(events: Formula1Event[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return events.find(
    (event) =>
      event.status === "scheduled" && new Date(event.dateStart) >= today,
  );
}

export default function Home() {
  const { events, loading, error } = useFormula1Events();
  const nextEvent = getNextEvent(events);

  if (loading) {
    return (
      <Container maxW="5xl" py="10">
        <Stack align="center" gap="4">
          <Spinner size="lg" />
          <Text>Carregando calendario da Formula 1...</Text>
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="5xl" py="10">
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Title>{error}</Alert.Title>
        </Alert.Root>
      </Container>
    );
  }

  return (
    <Container maxW="5xl" py="10">
      <Stack gap="8">
        <Stack gap="2">
          <Heading size="3xl">Formula 1</Heading>
          <Text color="fg.muted">Calendario de meetings da temporada.</Text>
        </Stack>

        <Card.Root>
          <Card.Body>
            <Stack gap="4">
              <Stack direction="row" justify="space-between" gap="4">
                <Heading size="lg">Proximo meeting</Heading>
                {nextEvent ? <Badge>{nextEvent.status}</Badge> : null}
              </Stack>

              {nextEvent ? (
                <Stack gap="3">
                  <Heading size="2xl">{nextEvent.name}</Heading>
                  <Text>
                    {nextEvent.location.country.name} - {nextEvent.location.city}
                  </Text>
                  <Text color="fg.muted">
                    {nextEvent.location.name} | {formatDate(nextEvent.dateStart)}{" "}
                    a {formatDate(nextEvent.dateEnd)}
                  </Text>
                  <Box>
                    <Button asChild>
                      <RouterLink to={`/meetings/${nextEvent.id}`}>
                        Ver detalhes
                      </RouterLink>
                    </Button>
                  </Box>
                </Stack>
              ) : (
                <Text>Nenhum proximo meeting encontrado.</Text>
              )}
            </Stack>
          </Card.Body>
        </Card.Root>

        <Stack gap="4">
          <Heading size="xl">Calendario</Heading>
          <Stack gap="3">
            {events.slice(0, 6).map((event) => (
              <Card.Root key={event.id}>
                <Card.Body>
                  <Stack
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    gap="3"
                  >
                    <Stack gap="1">
                      <Heading size="md">{event.name}</Heading>
                      <Text color="fg.muted">
                        {event.location.country.name} - {event.location.name}
                      </Text>
                    </Stack>
                    <Stack align={{ base: "flex-start", md: "flex-end" }} gap="1">
                      <Badge>{event.status}</Badge>
                      <Text color="fg.muted" fontSize="sm">
                        {formatDate(event.dateStart)} a {formatDate(event.dateEnd)}
                      </Text>
                    </Stack>
                  </Stack>
                </Card.Body>
              </Card.Root>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}
