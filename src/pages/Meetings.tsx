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
import { Link as RouterLink } from "react-router-dom";
import { useFormula1Events } from "../api/useFormula1Events";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Meetings() {
  const { events, loading, error } = useFormula1Events();

  if (loading) {
    return (
      <Container maxW="5xl" py="10">
        <Stack align="center" gap="4">
          <Spinner size="lg" />
          <Text>Carregando meetings...</Text>
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
      <Stack gap="6">
        <Stack gap="2">
          <Heading size="3xl">Meetings</Heading>
          <Text color="fg.muted">Lista de eventos retornados pela API REST.</Text>
        </Stack>

        {events.length === 0 ? (
          <Text>Nenhum meeting encontrado.</Text>
        ) : (
          <Stack gap="4">
            {events.map((event) => (
              <Card.Root key={event.id}>
                <Card.Body>
                  <Stack
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    gap="4"
                  >
                    <Stack gap="2">
                      <Stack direction="row" align="center" gap="3" wrap="wrap">
                        <Heading size="lg">{event.name}</Heading>
                        <Badge>{event.status}</Badge>
                      </Stack>
                      <Text>
                        {event.location.country.name} - {event.location.city}
                      </Text>
                      <Text color="fg.muted">{event.location.name}</Text>
                      <Text color="fg.muted" fontSize="sm">
                        {formatDate(event.dateStart)} a {formatDate(event.dateEnd)}
                      </Text>
                    </Stack>

                    <Stack align={{ base: "flex-start", md: "flex-end" }}>
                      <Button asChild variant="outline">
                        <RouterLink to={`/meetings/${event.id}`}>
                          Ver detalhes
                        </RouterLink>
                      </Button>
                    </Stack>
                  </Stack>
                </Card.Body>
              </Card.Root>
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
