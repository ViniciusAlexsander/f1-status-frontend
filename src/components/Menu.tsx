import { MobileNavDrawer } from "@/components/navigation/MobileNavDrawer";
import { NavLinks } from "@/components/navigation/NavLinks";
import { Box, Container, Flex, Heading, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export function Menu() {
  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="sticky"
      bg="bg/95"
      borderBottomWidth="1px"
      borderColor="border"
      backdropFilter="blur(8px)"
    >
      <Container maxW="5xl" py={{ base: 3, md: 4 }}>
        <Flex align="center" justify="space-between" gap="4">
          <Link asChild _hover={{ textDecoration: "none" }}>
            <RouterLink to="/">
              <Heading size={{ base: "md", md: "lg" }} fontWeight="bold">
                F1 Status
              </Heading>
            </RouterLink>
          </Link>

          <NavLinks variant="desktop" />

          <Flex align="center" gap="1">
            <MobileNavDrawer />
            {/* <ColorModeButton /> */}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
