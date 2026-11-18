import { FOOTER_ITEMS, NAV_ITEMS } from "@/config/navigation";
import { CONTACT_EMAIL, UNOFFICIAL_DISCLAIMER } from "@/config/site";
import { Box, Container, Flex, Link, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export function SiteFooter() {
  const primaryLinks = NAV_ITEMS.filter((item) => item.path !== "/");

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
            flexWrap="wrap"
          >
            {primaryLinks.map((item) => (
              <Link
                key={item.path}
                asChild
                color="fg.muted"
                _hover={{ color: "fg" }}
              >
                <RouterLink to={item.path}>{item.label}</RouterLink>
              </Link>
            ))}
            {FOOTER_ITEMS.map((item) => (
              <Link
                key={item.path}
                asChild
                color="fg.muted"
                _hover={{ color: "fg" }}
              >
                <RouterLink to={item.path}>{item.label}</RouterLink>
              </Link>
            ))}
          </Flex>
        </Flex>
        {CONTACT_EMAIL ? (
          <Text mt="4" color="fg.muted" fontSize="xs">
            Contato:{" "}
            <Link href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Link>
          </Text>
        ) : null}
        <Text mt="5" maxW="3xl" color="fg.muted" fontSize="xs" lineHeight="1.7">
          {UNOFFICIAL_DISCLAIMER}
        </Text>
      </Container>
    </Box>
  );
}
