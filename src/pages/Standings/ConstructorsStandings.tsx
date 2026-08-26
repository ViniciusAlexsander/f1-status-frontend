import { useConstructorsStandings } from "@/hooks/useConstructorsStandings";
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
  const {
    data: constructorsStandings,
    isLoading,
    isError,
  } = useConstructorsStandings();

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
        Construtores
      </Heading>
      <Table.Root size="sm" variant="outline">
        <TableBody>
          {constructorsStandings &&
            constructorsStandings.map((constructor) => (
              <TableRow key={constructor.id}>
                <TableCell>
                  <Heading size="lg" minW={5}>
                    {constructor.position}
                  </Heading>
                </TableCell>
                <TableCell>
                  <Badge bg={constructor.color} color="white">
                    {constructor.shortName}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Stat.Root>
                    <Stat.ValueText>{constructor.points}</Stat.ValueText>
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
