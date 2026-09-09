import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Flex, Heading, Spinner, Stack, Text } from "@chakra-ui/react";
import { useConstructorsStandings } from "@/hooks/useConstructorsStandings";
import { useDriversStandings } from "@/hooks/useDriversStandings";

type Tab = "pilotos" | "equipes";

type Props = {
  compact?: boolean;
};

export function StandingsPanel({ compact = false }: Props) {
  const [tab, setTab] = useState<Tab>("pilotos");
  const driversQuery = useDriversStandings();
  const constructorsQuery = useConstructorsStandings();
  const drivers = driversQuery.data ?? [];
  const constructors = constructorsQuery.data ?? [];
  const isLoading = driversQuery.isLoading || constructorsQuery.isLoading;
  const hasError = driversQuery.isError || constructorsQuery.isError;
  const rows = tab === "pilotos" ? drivers : constructors;
  const maxPoints = Math.max(rows[0]?.points ?? 0, 1);

  return (
    <Box id="classificacao" borderWidth="1px" borderColor="border" bg="card">
      <Flex align="center" justify="space-between" gap="3" borderBottomWidth="1px" borderColor="border" px="4" py="2.5">
        {compact ? (
          <Heading fontFamily="mono" fontSize="11px" letterSpacing="0.14em" textTransform="uppercase">Classificação</Heading>
        ) : (
          <RouterLink to="/standings">
            <Heading fontFamily="mono" fontSize="11px" letterSpacing="0.14em" textTransform="uppercase" _hover={{ color: "f1.500" }}>Classificação</Heading>
          </RouterLink>
        )}
        <Flex gap="1px" role="tablist" aria-label="Tipo de classificação">
          {(["pilotos", "equipes"] as const).map((value) => (
            <Button key={value} type="button" role="tab" aria-selected={tab === value} onClick={() => setTab(value)} size="xs" variant={tab === value ? "solid" : "outline"} colorPalette={tab === value ? "f1" : "gray"} textTransform="uppercase" fontFamily="mono" fontSize="10px" letterSpacing="0.08em" borderRadius="0">
              {value}
            </Button>
          ))}
        </Flex>
      </Flex>

      {isLoading ? (
        <Stack align="center" gap="2" p="6"><Spinner size="sm" /><Text fontSize="sm" color="fg.muted">Carregando classificação...</Text></Stack>
      ) : hasError ? (
        <Text p="5" fontSize="sm" color="f1.500">Não foi possível carregar a classificação.</Text>
      ) : tab === "pilotos" ? (
        <Stack gap="0" divideY="1px" divideColor="border">
          {drivers.slice(0, compact ? 12 : drivers.length).map((driver) => {
            const team = driver.teams[0];
            return (
              <Box key={driver.id} position="relative" px="4" py="2">
                <Box position="absolute" insetY="0" left="0" w={`${(driver.points / maxPoints) * 100}%`} bg={team?.color ?? "border"} opacity="0.14" />
                <Flex position="relative" align="center" gap="3">
                  <Text w="4" flexShrink="0" fontFamily="mono" fontSize="xs" color="fg.muted" fontVariantNumeric="tabular-nums">{driver.position}</Text>
                  <Box h="4" w="3px" flexShrink="0" bg={team?.color ?? "border"} />
                  <Text minW="0" flex="1" truncate fontSize="13px"><Text as="span" fontFamily="mono" fontWeight="600">{driver.code}</Text>{" "}<Text as="span" color="fg.muted">{team?.shortName}</Text></Text>
                  <Text w="10" textAlign="right" fontFamily="mono" fontSize="13px" fontVariantNumeric="tabular-nums">{driver.points}</Text>
                </Flex>
              </Box>
            );
          })}
        </Stack>
      ) : (
        <Stack gap="0" divideY="1px" divideColor="border">
          {constructors.map((constructor) => (
            <Box key={constructor.id} position="relative" px="4" py="2">
              <Box position="absolute" insetY="0" left="0" w={`${(constructor.points / maxPoints) * 100}%`} bg={constructor.color} opacity="0.14" />
              <Flex position="relative" align="center" gap="3">
                <Text w="4" flexShrink="0" fontFamily="mono" fontSize="xs" color="fg.muted" fontVariantNumeric="tabular-nums">{constructor.position}</Text>
                <Box h="4" w="3px" flexShrink="0" bg={constructor.color} />
                <Text minW="0" flex="1" truncate fontSize="13px">{constructor.name}</Text>
                <Text w="10" textAlign="right" fontFamily="mono" fontSize="13px" fontVariantNumeric="tabular-nums">{constructor.points}</Text>
              </Flex>
            </Box>
          ))}
        </Stack>
      )}

      <Flex borderTopWidth="1px" borderColor="border" align="center" justify="space-between" gap="3" px="4" py="2.5">
        <Text fontFamily="mono" fontSize="10px" letterSpacing="0.12em" color="fg.muted" textTransform="uppercase">
          {tab === "pilotos" ? (compact ? "Top 12 de 22 pilotos" : `${drivers.length} pilotos`) : `${constructors.length} equipes`}
        </Text>
        {compact && <RouterLink to="/standings"><Text fontFamily="mono" fontSize="10px" letterSpacing="0.08em" color="f1.500" textTransform="uppercase" _hover={{ textDecoration: "underline" }}>Ver classificação</Text></RouterLink>}
      </Flex>
    </Box>
  );
}
