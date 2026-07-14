import ConstructorsStandings from "./ConstructorsStandings";
import DriversStandings from "./DriversStandings";
import { Container, Heading, Stack, SegmentGroup, Box } from "@chakra-ui/react";
import { useState } from "react";

export default function Standings() {
  const [value, setValue] = useState<string | null>("Pilotos");
  return (
    <Container>
      <Stack mb="4">
        <Heading size="3xl">Classificação</Heading>
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
        direction="row"
        justifyContent="center"
        gap="24"
      >
        <DriversStandings />
        <ConstructorsStandings />
      </Stack>
    </Container>
  );
}
