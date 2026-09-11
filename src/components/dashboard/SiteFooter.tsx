import { Box, Container, Flex, Link, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export function SiteFooter() {
  return (
    <Box as="footer" mt="16" borderTopWidth="1px" borderColor="border">
      <Container maxW="1600px" px={{ base: 4, md: 6 }} py={{ base: 5, md: 6 }}>
        <Flex
          align={{ base: "flex-start", md: "center" }}
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          gap="4"
        >
          <Box>
            <Link
              asChild
              fontSize="sm"
              fontWeight="700"
              letterSpacing="0.16em"
              textTransform="uppercase"
              _hover={{ color: "f1.500", textDecoration: "none" }}
            >
              <RouterLink to="/">F1 Status</RouterLink>
            </Link>
            <Text mt="1" color="fg.muted" fontFamily="mono" fontSize="10px">
              Temporada 2026
            </Text>
          </Box>
          <Flex
            align={{ base: "flex-start", md: "center" }}
            direction={{ base: "column", md: "row" }}
            gap={{ base: "2", md: "5" }}
            fontFamily="mono"
            fontSize="10px"
            letterSpacing="0.1em"
            textTransform="uppercase"
          >
            <Link asChild color="fg.muted" _hover={{ color: "fg" }}>
              <RouterLink to="/standings">Classificação</RouterLink>
            </Link>
            <Link asChild color="fg.muted" _hover={{ color: "fg" }}>
              <RouterLink to="/live">Live timing</RouterLink>
            </Link>
            <Text color="fg.muted">F1 Status</Text>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
