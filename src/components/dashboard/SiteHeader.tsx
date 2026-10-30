import {
  Box,
  Container,
  Flex,
  HStack,
  Link,
  Text,
} from "@chakra-ui/react";
import { RiFlagLine, RiRadioLine } from "react-icons/ri";
import { Link as RouterLink, NavLink } from "react-router-dom";
import { MobileNavDrawer } from "@/components/navigation/MobileNavDrawer";

type SiteHeaderProps = {
  isLive: boolean;
  statusLabel: string;
  compactStatusLabel?: string;
};

export function SiteHeader({
  isLive,
  statusLabel,
  compactStatusLabel,
}: SiteHeaderProps) {
  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="30"
      bg="bg/90"
      borderBottomWidth="1px"
      borderColor={isLive ? "f1.500/35" : "border"}
      backdropFilter="blur(14px)"
    >
      <Box h="0.5" bg={isLive ? "f1.500" : "border"} />
      <Container maxW="1600px" py={{ base: 2, md: 4 }} px={{ base: 3, md: 6 }}>
        <Flex align="center" justify="space-between" gap="3">
          <Link
            asChild
            display="flex"
            flexShrink="0"
            _hover={{ textDecoration: "none" }}
          >
            <RouterLink to="/">
              <HStack minW="0" gap="3">
                <Box w="1.5" h="6" bg={isLive ? "f1.500" : "fg.muted"} />
                <Box lineHeight="1">
                  <Text
                    fontSize={{ base: "sm", md: "md" }}
                    fontWeight="700"
                    letterSpacing="0.18em"
                    textTransform="uppercase"
                  >
                    F1 Status
                  </Text>
                  <Text
                    mt="1"
                    fontFamily="mono"
                    fontSize="10px"
                    letterSpacing="0.14em"
                    color="fg.muted"
                    textTransform="uppercase"
                  >
                    Temporada 2026
                  </Text>
                </Box>
              </HStack>
            </RouterLink>
          </Link>

          <HStack display={{ base: "none", md: "flex" }} ml="auto" gap="1">
            {[
              ["Classificação", "/standings"],
              ["Live timing", "/live"],
            ].map(([label, href]) => (
              <NavLink
                key={href}
                to={href}
                end={href === "/"}
                style={({ isActive }) => ({
                  textDecoration: "none",
                  color: isActive
                    ? "var(--chakra-colors-fg)"
                    : "var(--chakra-colors-fg-muted)",
                  background: isActive
                    ? "var(--chakra-colors-bg-subtle)"
                    : "transparent",
                })}
              >
                <Box
                  px="3"
                  py="1.5"
                  _hover={{ bg: "bg.subtle", color: "fg" }}
                  fontFamily="mono"
                  fontSize="11px"
                  letterSpacing="0.12em"
                  textTransform="uppercase"
                >
                  {label}
                </Box>
              </NavLink>
            ))}
          </HStack>

          <HStack ml="auto" flexShrink="0" gap={{ base: 2, md: 3 }}>
            <HStack
              display={{ base: "none", md: "flex" }}
              gap="2"
              color="fg.muted"
            >
              {isLive ? <RiRadioLine /> : <RiFlagLine />}
              <Text
                fontFamily="mono"
                fontSize="11px"
                letterSpacing="0.12em"
                textTransform="uppercase"
              >
                {statusLabel}
              </Text>
            </HStack>

            <Box display={{ base: "block", md: "none" }}>
              <MobileNavDrawer />
            </Box>

          </HStack>
        </Flex>
      </Container>
      <Box
        display={{ base: "block", lg: "none" }}
        px={{ base: 3, md: 6 }}
        pb={{ base: 2, md: 3 }}
      >
        <Flex
          align="center"
          justify="space-between"
          gap="3"
          minW="0"
          fontFamily="mono"
          fontSize="10px"
          letterSpacing="0.12em"
          color="fg.muted"
          textTransform="uppercase"
        >
          <Text truncate>
            {isLive ? "Sessão em pista" : "Sem sessão em pista"}
          </Text>
          <Text truncate>{compactStatusLabel ?? statusLabel}</Text>
        </Flex>

      </Box>
    </Box>
  );
}
