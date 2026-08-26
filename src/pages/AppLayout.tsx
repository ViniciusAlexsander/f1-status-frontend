import { Outlet, useLocation } from "react-router-dom";
import { AdBanner } from "@/components/AdBanner";
import { Menu } from "@/components/Menu";
import { SiteHeader } from "@/components/dashboard/SiteHeader";
import { Box, Container } from "@chakra-ui/react";

export function AppLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const isLive = pathname === "/live";

  return (
    <Box py={isHome || isLive ? 0 : { base: 4, md: 8 }}>
      {isLive ? (
        <SiteHeader isLive statusLabel="Sessão ao vivo" />
      ) : (
        !isHome && <Menu />
      )}

      {!isHome && !isLive && (
        <Container maxW="5xl" py={{ base: 4, md: 6 }}>
          <AdBanner />
        </Container>
      )}

      <Outlet />
    </Box>
  );
}
