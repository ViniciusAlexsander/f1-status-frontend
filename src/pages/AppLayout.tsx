import { Outlet } from "react-router-dom";
import { AdBanner } from "@/components/AdBanner";
import { Menu } from "@/components/Menu";
import { Box, Container } from "@chakra-ui/react";

export function AppLayout() {
  return (
    <Box py="8">
      <Box paddingBottom="4">
        <Menu />
      </Box>

      <Container maxW="5xl" pb="6">
        <AdBanner />
      </Container>

      <Outlet />
    </Box>
  );
}
