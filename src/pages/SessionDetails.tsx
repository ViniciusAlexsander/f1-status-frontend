import {
  Alert,
  Badge,
  Button,
  Card,
  Container,
  Heading,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useListRaces } from "../hooks/useListRaces";
import { formatDate, formatDateTimeString } from "@/utils/date";

export default function SessionDetails() {
  const { meetingsId, sessionId } = useParams();

  // if (isLoading) {
  //   return (
  //     <Container maxW="5xl">
  //       <Stack align="center" gap="4">
  //         <Spinner size="lg" />
  //         <Text>Carregando meeting...</Text>
  //       </Stack>
  //     </Container>
  //   );
  // }

  // if (error) {
  //   return (
  //     <Container maxW="5xl">
  //       <Alert.Root status="error">
  //         <Alert.Indicator />
  //         <Alert.Title>{error.message}</Alert.Title>
  //       </Alert.Root>
  //     </Container>
  //   );
  // }

  // if (!event) {
  //   return (
  //     <Container maxW="5xl">
  //       <Stack gap="4">
  //         <Alert.Root status="warning">
  //           <Alert.Indicator />
  //           <Alert.Title>Meeting nao encontrado.</Alert.Title>
  //         </Alert.Root>
  //         <Button asChild alignSelf="flex-start" variant="outline">
  //           <RouterLink to="/">Voltar para meetings</RouterLink>
  //         </Button>
  //       </Stack>
  //     </Container>
  //   );
  // }

  return (
    <Container maxW="5xl">
      <Stack gap="6">
        <Text>Evento: {meetingsId}</Text>
        <Text>Sessão: {sessionId}</Text>
      </Stack>
    </Container>
  );
}
