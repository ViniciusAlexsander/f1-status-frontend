import ConstructorsStandings from "./ConstructorsStandings";
import DriversStandings from "./DriversStandings";
import { Container, Heading, Stack, SegmentGroup, Box } from "@chakra-ui/react";
import { useState } from "react";

export default function Standings() {
  const [value, setValue] = useState<string | null>("Pilotos");
  return (
    <Container maxW="1600px" px={{ base: 4, md: 6 }}>
      <Stack mb="6" gap="2">
        <Heading fontSize={{ base: "2xl", md: "4xl" }} fontWeight="600">
          Classificação
        </Heading>
        <Box h="1" w="12" bg="f1.500" />
      </Stack>
      <Box
        display={{
          base: "block",
          sm: "none",
        }}
      >
        <Box mb="4">
          <SegmentGroup.Root
            value={value}
            onValueChange={(e) => setValue(e.value)}
          >
            <SegmentGroup.Indicator />
            <SegmentGroup.Items items={["Pilotos", "Construtores"]} />
          </SegmentGroup.Root>
        </Box>

        {value === "Pilotos" ? <DriversStandings /> : <ConstructorsStandings />}
      </Box>
      <Stack
        display={{
          base: "none",
          sm: "flex",
        }}
        direction={{ sm: "column", lg: "row" }}
        justifyContent="center"
        gap={{ sm: "6", lg: "4" }}
      >
        <DriversStandings />
        <ConstructorsStandings />
      </Stack>
    </Container>
  );
}
