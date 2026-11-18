import { PageIntro } from "@/components/content/PageIntro";
import { getSitePage } from "@/content/sitePages";
import { Container, Grid, Stack } from "@chakra-ui/react";
import DriversStandings from "./DriversStandings";
import ConstructorsStandings from "./ConstructorsStandings";

const standingsIntro = getSitePage("/standings");

export default function Standings() {
  return (
    <Container maxW="1600px" px={{ base: 4, md: 6 }}>
      <Stack gap="6">
        {standingsIntro && <PageIntro page={standingsIntro} />}
        <Grid
          templateColumns={{ base: "1fr", lg: "repeat(2, minmax(0, 1fr))" }}
          gap="4"
        >
          <DriversStandings />
          <ConstructorsStandings />
        </Grid>
      </Stack>
    </Container>
  );
}
