import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { api } from "@/config/axios";

const TOPICS = [
  "SessionInfo",
  "SessionData",
  "SessionStatus",
  "ExtrapolatedClock",
  "ArchiveStatus",
  "Heartbeat",
  "TimingData",
  "TimingDataF1",
  "TimingAppData",
  "TimingStats",
  "LapSeries",
  "TopThree",
  "DriverList",
  "TrackStatus",
  "RaceControlMessages",
  "DriverTracker",
  "Position.z",
  "CarData.z",
  "PitLaneTimeCollection",
  "WeatherData",
  "WeatherDataSeries",
  "CurrentTyres",
  "TyreStintSeries",
  "ContentStreams",
  "AudioStreams",
] as const;

type TopicEvent = {
  id: string;
  topic: string;
  payload: unknown;
  receivedAt: string;
  isSnapshot: boolean;
};

type HistoryResponse = {
  topic: string;
  events: TopicEvent[];
  total: number;
  nextBefore: string | null;
};

type CollectorStatus = { connected: boolean };

export default function LiveTopicsDev() {
  const [selectedTopic, setSelectedTopic] = useState<string>(TOPICS[0]);
  const [events, setEvents] = useState<TopicEvent[]>([]);
  const [total, setTotal] = useState(0);
  const [connected, setConnected] = useState<boolean | undefined>();
  const [loading, setLoading] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [error, setError] = useState<string>();
  const selectedTopicRef = useRef(selectedTopic);
  selectedTopicRef.current = selectedTopic;

  const fetchLatest = useCallback(async () => {
    try {
      const [historyResponse, statusResponse] = await Promise.all([
        api.get<HistoryResponse>(
          `/v1/live-timing/topics/${encodeURIComponent(selectedTopic)}/history`,
          { params: { limit: 100 } },
        ),
        api.get<CollectorStatus>("/v1/live-timing/topics/status"),
      ]);
      if (selectedTopicRef.current !== selectedTopic) return;
      const latest = historyResponse.data;
      setEvents((current) => {
        const byId = new Map<string, TopicEvent>();
        for (const event of [...latest.events, ...current]) byId.set(event.id, event);
        return [...byId.values()].sort((a, b) => b.id.localeCompare(a.id));
      });
      setTotal(latest.total);
      setConnected(statusResponse.data.connected);
      setError(undefined);
    } catch (cause) {
      if (selectedTopicRef.current === selectedTopic) {
        setError(cause instanceof Error ? cause.message : "Falha ao consultar o histórico.");
      }
    } finally {
      if (selectedTopicRef.current === selectedTopic) setLoading(false);
    }
  }, [selectedTopic]);

  useEffect(() => {
    setEvents([]);
    setTotal(0);
    setLoading(true);
    setLoadingOlder(false);
    void fetchLatest();
    const interval = window.setInterval(() => void fetchLatest(), 3000);
    return () => window.clearInterval(interval);
  }, [fetchLatest]);

  const loadOlder = async () => {
    const before = events.at(-1)?.id;
    if (!before) return;
    setLoadingOlder(true);
    try {
      const response = await api.get<HistoryResponse>(
        `/v1/live-timing/topics/${encodeURIComponent(selectedTopic)}/history`,
        { params: { limit: 100, before } },
      );
      if (selectedTopicRef.current !== selectedTopic) return;
      const older = response.data;
      setEvents((current) => {
        const byId = new Map(current.map((event) => [event.id, event]));
        for (const event of older.events) byId.set(event.id, event);
        return [...byId.values()].sort((a, b) => b.id.localeCompare(a.id));
      });
      setTotal(older.total);
    } catch (cause) {
      if (selectedTopicRef.current === selectedTopic) {
        setError(cause instanceof Error ? cause.message : "Falha ao carregar eventos anteriores.");
      }
    } finally {
      if (selectedTopicRef.current === selectedTopic) setLoadingOlder(false);
    }
  };

  return (
    <Container maxW="1600px" px={{ base: 4, md: 6 }}>
      <Stack gap="6" py={{ base: 6, md: 10 }}>
        <Stack gap="2">
          <Text
            fontFamily="mono"
            fontSize="xs"
            letterSpacing="0.14em"
            color="f1.500"
            textTransform="uppercase"
          >
            Ferramentas de desenvolvimento
          </Text>
          <Flex align={{ base: "flex-start", md: "center" }} justify="space-between" gap="4" wrap="wrap">
            <Box>
              <Heading size={{ base: "xl", md: "2xl" }}>Live topic inspector</Heading>
              <Text mt="2" color="fg.muted">
                O backend escuta e registra os eventos continuamente, mesmo quando esta página está fechada.
              </Text>
            </Box>
            <Badge colorPalette={connected ? "green" : "yellow"}>
              {connected === undefined ? "Verificando coletor" : connected ? "Coletor conectado" : "Coletor reconectando"}
            </Badge>
          </Flex>
        </Stack>

        {error && (
          <Alert.Root status="error">
            <Alert.Indicator />
            <Alert.Title>{error}</Alert.Title>
          </Alert.Root>
        )}

        <Box
          overflowX={{ base: "auto", md: "visible" }}
          pb={{ base: 2, md: 0 }}
          css={{
            scrollbarWidth: { base: "thin", md: "auto" },
            WebkitOverflowScrolling: "touch",
          }}
        >
          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 2, xl: 5 }}
            gap="3"
            minW={{ base: "max-content", md: "0" }}
            gridAutoFlow={{ base: "column", md: "row" }}
            gridAutoColumns={{ base: "minmax(180px, 72vw)", md: "auto" }}
            templateRows={{ base: "repeat(2, auto)", md: "none" }}
          >
            {TOPICS.map((name) => (
              <Box
                as="button"
                key={name}
                textAlign="left"
                borderWidth="1px"
                borderColor={selectedTopic === name ? "f1.500" : "border"}
                bg={selectedTopic === name ? "bg.subtle" : "card"}
                p="4"
                onClick={() => setSelectedTopic(name)}
              >
                <Text fontFamily="mono" fontWeight="600" fontSize="sm">
                  {name}
                </Text>
                {selectedTopic === name && (
                  <Text mt="2" color="fg.muted" fontSize="xs" fontFamily="mono">
                    {total.toLocaleString()} eventos salvos
                  </Text>
                )}
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        <Box borderWidth="1px" borderColor="border" bg="card">
          <Flex
            align={{ base: "flex-start", md: "center" }}
            justify="space-between"
            gap="3"
            wrap="wrap"
            px="4"
            py="3"
            borderBottomWidth="1px"
            borderColor="border"
          >
            <Box>
              <Text fontFamily="mono" fontWeight="600">{selectedTopic}</Text>
              <Text color="fg.muted" fontSize="xs" fontFamily="mono">
                Histórico bruto · atualiza a cada 3 segundos
              </Text>
            </Box>
            <Text color="fg.muted" fontSize="xs" fontFamily="mono">
              Exibindo {events.length.toLocaleString()} de {total.toLocaleString()} eventos
            </Text>
          </Flex>

          {events.length < total && events.length > 0 && (
            <Box px="4" py="3" borderBottomWidth="1px" borderColor="border">
              <Button size="sm" variant="outline" onClick={() => void loadOlder()} loading={loadingOlder}>
                Carregar eventos anteriores
              </Button>
            </Box>
          )}

          {loading && events.length === 0 ? (
            <Text p="5" color="fg.muted">Carregando histórico...</Text>
          ) : events.length === 0 ? (
            <Text p="5" color="fg.muted">Nenhum evento registrado para este tópico ainda.</Text>
          ) : (
            <Stack gap="0" divideY="1px" divideColor="border">
              {events.map((event) => (
                <Box key={event.id} p={{ base: 4, md: 5 }}>
                  <Flex align="center" justify="space-between" gap="3" wrap="wrap" mb="3">
                    <Text fontFamily="mono" fontSize="xs" color="fg.muted">
                      {new Date(event.receivedAt).toLocaleString()}
                    </Text>
                    <Badge colorPalette={event.isSnapshot ? "blue" : "gray"}>
                      {event.isSnapshot ? "Snapshot" : "Atualização"}
                    </Badge>
                  </Flex>
                  <Box
                    as="pre"
                    m="0"
                    overflowX="auto"
                    maxH="55vh"
                    fontFamily="mono"
                    fontSize="xs"
                    lineHeight="1.65"
                    color="fg"
                  >
                    {JSON.stringify(event.payload, null, 2)}
                  </Box>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </Stack>
    </Container>
  );
}
