import { Outlet, useLocation } from "react-router-dom";
import { AdBanner } from "@/components/AdBanner";
import { SiteHeader } from "@/components/dashboard/SiteHeader";
import { SiteFooter } from "@/components/dashboard/SiteFooter";
import { isContentPath } from "@/config/navigation";
import { Box, Container } from "@chakra-ui/react";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";

export function AppLayout() {
  const { pathname, hash } = useLocation();
  const isHome = pathname === "/";
  const isLive = pathname === "/live";
  const showLayoutAd = !isHome && !isLive && !isContentPath(pathname);

  useEffect(() => {
    if (!hash) return;

    const elementId = hash.replace("#", "");
    const element = document.getElementById(elementId);

    if (!element) return;

    const scrollToElement = () => {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    requestAnimationFrame(scrollToElement);
  }, [hash, pathname]);

  return (
    <Box minH="100dvh">
      {!isHome && (
        <SiteHeader
          isLive={isLive}
          statusLabel={isLive ? "Sessão ao vivo" : "Sem sessão em pista"}
          compactStatusLabel={isLive ? "Sessão ao vivo" : "Sem sessão em pista"}
        />
      )}

      {showLayoutAd && (
        <Container
          maxW="1600px"
          px={{ base: 4, md: 6 }}
          py={{ base: 4, md: 6 }}
        >
          <AdBanner />
        </Container>
      )}

      <Outlet />
      <SiteFooter />
      <Toaster />
    </Box>
  );
}
