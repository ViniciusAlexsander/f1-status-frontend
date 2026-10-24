import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TOPICS = [
  {
    name: "SessionInfo",
    endpoint: "/v1/live-timing/session-info",
    event: "session_info_update",
  },
  {
    name: "ExtrapolatedClock",
    endpoint: "/v1/live-timing/extrapolated-clock",
    event: "extrapolated_clock_update",
  },
  {
    name: "WeatherData",
    endpoint: "/v1/live-timing/weather-data",
    event: "weather_data_update",
  },
  {
    name: "RaceControlMessages",
    endpoint: "/v1/live-timing/race-control-messages",
    event: "race_control_messages_update",
  },
] as const;

type StreamState = "connecting" | "connected" | "error";
const STORAGE_KEY = "f1-status:dev-live-topic-payloads";

function readStoredPayloads(): Record<string, unknown> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

export default function LiveTopicsDev() {
  const [selectedTopic, setSelectedTopic] = useState<string>(TOPICS[0].name);
  const [payloads, setPayloads] = useState<Record<string, unknown>>(
    readStoredPayloads,
  );
  const [states, setStates] = useState<Record<string, StreamState>>({});
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [receivedAt, setReceivedAt] = useState<Record<string, string>>({});
  const topic = TOPICS.find(({ name }) => name === selectedTopic) ?? TOPICS[0];

  useEffect(() => {
    setStates((current) => ({ ...current, [topic.name]: "connecting" }));
    const source = new EventSource(`${API_BASE_URL}${topic.endpoint}`);

    source.onopen = () => {
      setStates((current) => ({ ...current, [topic.name]: "connected" }));
    };
    source.addEventListener(topic.event, (event) => {
      try {
        const payload = JSON.parse((event as MessageEvent<string>).data) as unknown;
        setPayloads((current) => {
          const updated = { ...current, [topic.name]: payload };
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          } catch {
            // Keep the inspector usable if storage is unavailable or full.
          }
          return updated;
        });
        setCounts((current) => ({
          ...current,
          [topic.name]: (current[topic.name] ?? 0) + 1,
        }));
        setReceivedAt((current) => ({
          ...current,
          [topic.name]: new Date().toLocaleTimeString(),
        }));
      } catch {
        setStates((current) => ({ ...current, [topic.name]: "error" }));
      }
    });
    source.onerror = () => {
      setStates((current) => ({ ...current, [topic.name]: "error" }));
    };

    return () => source.close();
  }, [topic]);

  const stateLabel = {
    connecting: "Conectando",
    connected: "Conectado",
    error: "Reconectando / erro",
  }[states[topic.name] ?? "connecting"];

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
          <Heading size={{ base: "xl", md: "2xl" }}>Live topic inspector</Heading>
          <Text color="fg.muted">
            Inspecione o payload bruto recebido de cada tópico novo do Live Timing.
          </Text>
        </Stack>

        <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap="3">
          {TOPICS.map((item) => (
            <Box
              as="button"
              key={item.name}
              textAlign="left"
              borderWidth="1px"
              borderColor={selectedTopic === item.name ? "f1.500" : "border"}
              bg={selectedTopic === item.name ? "bg.subtle" : "card"}
              p="4"
              onClick={() => setSelectedTopic(item.name)}
            >
              <Flex align="center" justify="space-between" gap="2">
                <Text fontFamily="mono" fontWeight="600" fontSize="sm">
                  {item.name}
                </Text>
                {counts[item.name] ? (
                  <Badge colorPalette="green">{counts[item.name]} eventos</Badge>
                ) : null}
              </Flex>
              <Text mt="2" color="fg.muted" fontSize="xs" fontFamily="mono">
                {item.endpoint}
              </Text>
            </Box>
          ))}
        </SimpleGrid>

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
              <Text fontFamily="mono" fontWeight="600">{topic.name}</Text>
              <Text color="fg.muted" fontSize="xs" fontFamily="mono">
                Evento SSE: {topic.event}
              </Text>
            </Box>
            <Flex gap="3" align="center">
              <Badge colorPalette={states[topic.name] === "connected" ? "green" : "yellow"}>
                {stateLabel}
              </Badge>
              <Text color="fg.muted" fontSize="xs" fontFamily="mono">
                {counts[topic.name] ?? 0} eventos
              </Text>
              {receivedAt[topic.name] && (
                <Text color="fg.muted" fontSize="xs" fontFamily="mono">
                  Último: {receivedAt[topic.name]}
                </Text>
              )}
            </Flex>
          </Flex>
          <Box
            as="pre"
            m="0"
            p={{ base: 4, md: 5 }}
            overflowX="auto"
            minH="320px"
            maxH="70vh"
            fontFamily="mono"
            fontSize="sm"
            lineHeight="1.65"
            color="fg"
          >
            {payloads[topic.name] === undefined
              ? "Aguardando o primeiro payload deste tópico..."
              : JSON.stringify(payloads[topic.name], null, 2)}
          </Box>
        </Box>
      </Stack>
    </Container>
  );
}
