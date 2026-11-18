import { Box, Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export default function NotFound() {
  return (
    <Container maxW="3xl" px={{ base: 4, md: 6 }} py={{ base: 12, md: 16 }}>
      <Stack gap="5">
        <Heading as="h1" size="2xl">
          Página não encontrada
        </Heading>
        <Text color="fg.muted" lineHeight="1.8">
          Esse endereço não existe no F1 Status. Volte ao início para o
          calendário da temporada, abra a classificação ou leia os guias sobre
          sessões, gaps e live timing.
        </Text>
        <Box display="flex" flexWrap="wrap" gap="3">
          <Button asChild>
            <RouterLink to="/">Início</RouterLink>
          </Button>
          <Button asChild variant="outline">
            <RouterLink to="/standings">Classificação</RouterLink>
          </Button>
          <Button asChild variant="outline">
            <RouterLink to="/guias">Guias</RouterLink>
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}
