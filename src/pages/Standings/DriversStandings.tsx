import { useDriversStandings } from "@/hooks/useDriversStandings";
import {
  Alert,
  Box,
  Flex,
  Heading,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";

export default function DriversStandings() {
  const { data: driversStandings, isLoading, isError } = useDriversStandings();

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
    <Box borderWidth="1px" borderColor="border" bg="card">
      <Flex
        align="center"
        justify="space-between"
        borderBottomWidth="1px"
        borderColor="border"
        px="4"
        py="2.5"
      >
        <Heading
          fontFamily="mono"
          fontSize="11px"
          letterSpacing="0.14em"
          textTransform="uppercase"
        >
          Pilotos
        </Heading>
        <Text
          fontFamily="mono"
          fontSize="10px"
          color="fg.muted"
          textTransform="uppercase"
        >
          {driversStandings?.length ?? 0} pilotos
        </Text>
      </Flex>
      <Stack gap="0" divideY="1px" divideColor="border">
        {driversStandings?.map((driver, index) => {
          const team = driver.teams[0];
          const maxPoints = driversStandings[0]?.points || 1;
          return (
            <Box key={driver.id} position="relative" px="4" py="2">
              <Box
                position="absolute"
                insetY="0"
                left="0"
                w={`${(driver.points / maxPoints) * 100}%`}
                bg={team?.color ?? "border"}
                opacity="0.14"
              />
              <Flex position="relative" align="center" gap="3">
                <Text
                  w="4"
                  flexShrink="0"
                  fontFamily="mono"
                  fontSize="xs"
                  color="fg.muted"
                  fontVariantNumeric="tabular-nums"
                >
                  {driver.position || index + 1}
                </Text>
                <Box
                  h="4"
                  w="3px"
                  flexShrink="0"
                  bg={team?.color ?? "border"}
                />
                <Text minW="0" flex="1" truncate fontSize="13px">
                  <Text as="span" fontFamily="mono" fontWeight="600">
                    {driver.code}
                  </Text>{" "}
                  <Text as="span" color="fg.muted">
                    {team?.shortName}
                  </Text>
                </Text>
                <Text
                  w="10"
                  textAlign="right"
                  fontFamily="mono"
                  fontSize="13px"
                  fontVariantNumeric="tabular-nums"
                >
                  {driver.points}
                </Text>
              </Flex>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
