import { Outlet } from "react-router-dom";
import { AdBanner } from "@/components/AdBanner";
import { Menu } from "@/components/Menu";
import { Box, Container } from "@chakra-ui/react";

export function AppLayout() {
  return (
    <Box py={{ base: 4, md: 8 }}>
      <Menu />

      <Container maxW="5xl" py={{ base: 4, md: 6 }}>
        <AdBanner />
      </Container>

      <Outlet />
    </Box>
  );
}
