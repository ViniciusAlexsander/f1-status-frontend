import { Container, Grid } from "@chakra-ui/react";
import DriversStandings from "./DriversStandings";
import ConstructorsStandings from "./ConstructorsStandings";

export default function Standings() {
  return (
    <Container maxW="1600px" px={{ base: 4, md: 6 }}>
      <Grid
        templateColumns={{ base: "1fr", lg: "repeat(2, minmax(0, 1fr))" }}
        gap="4"
      >
        <DriversStandings />
        <ConstructorsStandings />
      </Grid>
    </Container>
  );
}
