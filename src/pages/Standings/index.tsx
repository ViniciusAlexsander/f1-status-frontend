import { useDriversStandings } from "@/hooks/useListRaces copy";
import {
  Alert,
  Badge,
  Button,
  Card,
  Container,
  Heading,
  Spinner,
  Stack,
  Stat,
  Text,
} from "@chakra-ui/react";

export default function Standings() {
  const { data: driversStandings, isLoading, isError } = useDriversStandings();

  if (isLoading) {
    return (
      <Container maxW="5xl">
        <Stack align="center" gap="4">
          <Spinner size="lg" />
          <Text>Carregando classificação</Text>
        </Stack>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxW="5xl">
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Title>Erro ao carregar classificação</Alert.Title>
        </Alert.Root>
      </Container>
    );
  }

  return (
    <Container maxW="5xl">
      <Stack gap="4">
        <Stack gap="2">
          <Heading size="3xl">Classificação de pilotos</Heading>
        </Stack>
        {driversStandings &&
          driversStandings.map((driver) => (
            <Stack
              key={driver.id}
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              gap="4"
            >
              <Stack direction="row" gap="6">
                <Stack direction="row" align="center" gap="4" wrap="wrap">
                  <Heading size="lg" minW={5}>
                    {driver.position}
                  </Heading>
                  <Badge color={driver.teams[0].color} minW={8}>
                    {driver.code}
                  </Badge>
                </Stack>
                <Stack
                  display={{
                    base: "none",
                    sm: "block",
                  }}
                >
                  <Text textStyle="sm" fontWeight="bold" minWidth={32}>
                    {driver.firstName} {driver.lastName}
                  </Text>
                  <Text textStyle="xs">{driver.teams[0].shortName}</Text>
                </Stack>
                <Stack>
                  <Stat.Root>
                    <Stat.ValueText>{driver.points}</Stat.ValueText>
                    <Stat.ValueUnit>pontos</Stat.ValueUnit>
                  </Stat.Root>
                </Stack>
              </Stack>
            </Stack>
          ))}
      </Stack>
    </Container>
  );
}
