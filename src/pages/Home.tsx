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
import { useListRaces } from "../api/useListRaces";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Home() {
  const { raceList, loading, error } = useListRaces();

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
          <Text color="fg.muted">Calendario de corridas da temporada.</Text>
        </Stack>

        <Card.Root>
          <Card.Body>
            <Stack gap="4">
              <Stack direction="row" justify="space-between" gap="4">
                <Heading size="lg">Proxima race week</Heading>
                {raceList?.nextRace ? (
                  <Badge>{raceList?.nextRace.status}</Badge>
                ) : null}
              </Stack>

              {raceList?.nextRace ? (
                <Stack gap="3">
                  <Heading size="2xl">{raceList?.nextRace.name}</Heading>
                  <Text>
                    {raceList?.nextRace.location.country.name} -{" "}
                    {raceList?.nextRace.location.city}
                  </Text>
                  <Text color="fg.muted">
                    {raceList?.nextRace.location.name} |{" "}
                    {formatDate(raceList?.nextRace.dateStart)} a{" "}
                    {formatDate(raceList?.nextRace.dateEnd)}
                  </Text>
                  <Box>
                    <Button asChild>
                      <RouterLink to={`/meetings/${raceList?.nextRace.id}`}>
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
          <Heading size="xl">Calendario completo</Heading>
          <Stack gap="4">
            {raceList?.races.map((race) => (
              <Card.Root key={race.id}>
                <Card.Body>
                  <Stack
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    gap="4"
                  >
                    <Stack gap="2">
                      <Stack direction="row" align="center" gap="3" wrap="wrap">
                        <Heading size="lg">{race.name}</Heading>
                        <Badge>{race.status}</Badge>
                      </Stack>
                      <Text>
                        {race.location.country.name} - {race.location.city}
                      </Text>
                      <Text color="fg.muted">{race.location.name}</Text>
                      <Text color="fg.muted" fontSize="sm">
                        {formatDate(race.dateStart)} a{" "}
                        {formatDate(race.dateEnd)}
                      </Text>
                    </Stack>

                    <Stack align={{ base: "flex-start", md: "flex-end" }}>
                      <Button asChild variant="outline">
                        <RouterLink to={`/meetings/${race.id}`}>
                          Ver detalhes
                        </RouterLink>
                      </Button>
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
