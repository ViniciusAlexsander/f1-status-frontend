import {
  Alert,
  Badge,
  Button,
  Card,
  Container,
  Heading,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useFormula1Events } from "../api/useFormula1Events";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date: string) {
  return new Date(date).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MeetingDetails() {
  const { id } = useParams();
  const { events, loading, error } = useFormula1Events();
  const event = events.find((formula1Event) => formula1Event.id === id);

  if (loading) {
    return (
      <Container maxW="5xl" py="10">
        <Stack align="center" gap="4">
          <Spinner size="lg" />
          <Text>Carregando meeting...</Text>
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

  if (!event) {
    return (
      <Container maxW="5xl" py="10">
        <Stack gap="4">
          <Alert.Root status="warning">
            <Alert.Indicator />
            <Alert.Title>Meeting nao encontrado.</Alert.Title>
          </Alert.Root>
          <Button asChild alignSelf="flex-start" variant="outline">
            <RouterLink to="/meetings">Voltar para meetings</RouterLink>
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxW="5xl" py="10">
      <Stack gap="6">
        <Button asChild alignSelf="flex-start" variant="outline">
          <RouterLink to="/meetings">Voltar</RouterLink>
        </Button>

        <Card.Root>
          <Card.Body>
            <Stack gap="4">
              <Stack direction="row" align="center" gap="3" wrap="wrap">
                <Heading size="3xl">{event.name}</Heading>
                <Badge>{event.status}</Badge>
              </Stack>
              <Stack gap="1">
                <Text fontSize="lg">
                  {event.location.country.name} - {event.location.city}
                </Text>
                <Text color="fg.muted">{event.location.name}</Text>
                <Text color="fg.muted">
                  {formatDate(event.dateStart)} a {formatDate(event.dateEnd)}
                </Text>
              </Stack>
            </Stack>
          </Card.Body>
        </Card.Root>

        <Stack gap="4">
          <Heading size="xl">Schedule</Heading>
          {event.schedule.length === 0 ? (
            <Text>Nenhuma sessao cadastrada para este meeting.</Text>
          ) : (
            <Stack gap="3">
              {event.schedule.map((session) => (
                <Card.Root key={session.id}>
                  <Card.Body>
                    <Stack
                      direction={{ base: "column", md: "row" }}
                      justify="space-between"
                      gap="3"
                    >
                      <Stack gap="2">
                        <Heading size="md">{session.name}</Heading>
                        <Stack direction="row" gap="2" wrap="wrap">
                          <Badge>{session.type}</Badge>
                          <Badge variant="outline">{session.status}</Badge>
                        </Stack>
                      </Stack>
                      <Stack align={{ base: "flex-start", md: "flex-end" }} gap="1">
                        <Text color="fg.muted" fontSize="sm">
                          Inicio: {formatDateTime(session.startTime)}
                        </Text>
                        <Text color="fg.muted" fontSize="sm">
                          Fim: {formatDateTime(session.endTime)}
                        </Text>
                      </Stack>
                    </Stack>
                  </Card.Body>
                </Card.Root>
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>
    </Container>
  );
}
