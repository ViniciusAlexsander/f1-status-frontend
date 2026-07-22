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
import { useListRaces } from "../../hooks/useListRaces";
import { CountDown } from "./components/CountDown";
import { formatDateTime, formatDateWithoutTime } from "@/utils/date";

export default function Home() {
  const { data, isLoading, isError, error } = useListRaces();

  if (isLoading) {
    return (
      <Container maxW="5xl">
        <Stack align="center" gap="4">
          <Spinner size="lg" />
          <Text>Carregando calendario da Formula 1...</Text>
        </Stack>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxW="5xl">
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Title>{error.message}</Alert.Title>
        </Alert.Root>
      </Container>
    );
  }

  return (
    <Container maxW="5xl">
      {data && (
        <Stack gap="8">
          <Stack gap="2">
            <Heading size="3xl">Formula 1</Heading>
            <Text color="fg.muted">Calendario de corridas da temporada.</Text>
          </Stack>

          {data.currentRace && (
            <Card.Root>
              <Card.Body>
                <Stack gap="4">
                  <Stack direction="row" justify="space-between" gap="4">
                    <Heading size="lg">Race week atual</Heading>
                    <Badge>{data.currentRace.status}</Badge>
                  </Stack>

                  <Stack
                    gap="3"
                    direction="row"
                    justify="space-between"
                    align="center"
                  >
                    <Stack gap="3">
                      <Heading size="2xl">{data.currentRace.name}</Heading>
                      <Text>
                        {data.currentRace.location.country.name} -{" "}
                        {data.currentRace.location.city}
                      </Text>
                      <Text color="fg.muted">
                        {data.currentRace.location.name} |{" "}
                        {formatDateWithoutTime(data.currentRace.dateStart)} a{" "}
                        {formatDateWithoutTime(data.currentRace.dateEnd)}
                      </Text>
                      <Stack direction={{ base: "column", md: "row" }}>
                        {data.currentRace.schedule.map((session) => (
                          <Card.Root key={session.id}>
                            <Card.Body>
                              <Stack
                                direction={{ base: "row", md: "column" }}
                                justify="space-between"
                                gap="3"
                              >
                                <Stack gap="2">
                                  <Heading size="md">
                                    {session.type === "practice"
                                      ? "Treino livre "
                                      : ""}
                                    {session.name}
                                  </Heading>
                                  <Stack direction="row" gap="2" wrap="wrap">
                                    <Badge variant="outline">
                                      {session.status}
                                    </Badge>
                                  </Stack>
                                </Stack>
                                <Stack align={{ base: "flex-start" }} gap="1">
                                  <Text color="fg.muted" fontSize="sm">
                                    {formatDateTime(session.startTime)}
                                  </Text>
                                  <Text color="fg.muted" fontSize="sm">
                                    até {formatDateTime(session.endTime)}
                                  </Text>
                                </Stack>
                              </Stack>
                            </Card.Body>
                          </Card.Root>
                        ))}
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </Card.Body>
            </Card.Root>
          )}

          {!data.currentRace && data.nextRace && (
            <Card.Root>
              <Card.Body>
                <Stack gap="4">
                  <Stack direction="row" justify="space-between" gap="4">
                    <Heading size="lg">Próxima race week</Heading>
                    <Badge>{data.nextRace.status}</Badge>
                  </Stack>

                  <Stack
                    gap="3"
                    direction="row"
                    justify="space-between"
                    align="center"
                  >
                    <Stack gap="3">
                      <Heading size="2xl">{data.nextRace.name}</Heading>
                      <Text>
                        {data.nextRace.location.country.name} -{" "}
                        {data.nextRace.location.city}
                      </Text>
                      <Text color="fg.muted">
                        {data.nextRace.location.name} |{" "}
                        {formatDateWithoutTime(data.nextRace.dateStart)} a{" "}
                        {formatDateWithoutTime(data.nextRace.dateEnd)}
                      </Text>
                      <Box>
                        <Button asChild>
                          <RouterLink to={`/meetings/${data.nextRace.id}`}>
                            Ver detalhes
                          </RouterLink>
                        </Button>
                      </Box>
                    </Stack>
                    <CountDown nextRace={data.nextRace} />
                  </Stack>
                </Stack>
              </Card.Body>
            </Card.Root>
          )}

          <Stack gap="4">
            <Heading size="xl">Calendario completo</Heading>
            <Stack gap="4">
              {data.races.map((race) => (
                <Card.Root key={race.id}>
                  <Card.Body>
                    <Stack
                      direction={{ base: "column", md: "row" }}
                      justify="space-between"
                      gap="4"
                    >
                      <Stack gap="2">
                        <Stack
                          direction="row"
                          align="center"
                          gap="3"
                          wrap="wrap"
                        >
                          <Heading size="lg">{race.name}</Heading>
                          <Badge>{race.status}</Badge>
                        </Stack>
                        <Text>
                          {race.location.country.name} - {race.location.city}
                        </Text>
                        <Text color="fg.muted">{race.location.name}</Text>
                        <Text color="fg.muted" fontSize="sm">
                          {formatDateWithoutTime(race.dateStart)} a{" "}
                          {formatDateWithoutTime(race.dateEnd)}
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
      )}
    </Container>
  );
}
