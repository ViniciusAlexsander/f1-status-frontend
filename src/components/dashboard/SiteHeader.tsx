import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Link,
  Text,
} from "@chakra-ui/react";
import { RiFlagLine, RiRadioLine } from "react-icons/ri";
import { Link as RouterLink, NavLink } from "react-router-dom";

type SiteHeaderProps = {
  isLive: boolean;
  statusLabel: string;
  compactStatusLabel?: string;
  onToggleLive?: () => void;
};

export function SiteHeader({
  isLive,
  statusLabel,
  compactStatusLabel,
  onToggleLive,
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
      <Container maxW="1600px" py={{ base: 3, md: 4 }} px={{ base: 4, md: 6 }}>
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

            {onToggleLive && (
              <Button
                display={{ base: "none", md: "inline-flex" }}
                size="sm"
                variant={isLive ? "subtle" : "outline"}
                colorPalette={isLive ? "f1" : "gray"}
                onClick={onToggleLive}
                fontFamily="mono"
                fontSize="10px"
                letterSpacing="0.12em"
                textTransform="uppercase"
              >
                <Box
                  w="2"
                  h="2"
                  borderRadius="full"
                  bg={isLive ? "f1.500" : "fg.muted"}
                />
                {isLive ? "Ao vivo" : "Fora do ar"}
              </Button>
            )}
          </HStack>
        </Flex>
      </Container>
      <Box
        display={{ base: "block", lg: "none" }}
        px={{ base: 4, md: 6 }}
        pb="3"
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

        <HStack
          gap="0"
          overflowX="auto"
          pt="3"
          css={{
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {[
            ["Classificação", "/standings"],
            ["Live", "/live"],
          ].map(([label, href]) => (
            <NavLink
              key={href}
              to={href}
              end={href === "/"}
              style={({ isActive }) => ({
                textDecoration: "none",
                whiteSpace: "nowrap",
                flexShrink: 0,
                color: isActive
                  ? "var(--chakra-colors-fg)"
                  : "var(--chakra-colors-fg-muted)",
                borderBottom: isActive
                  ? "2px solid var(--chakra-colors-f1-500)"
                  : "2px solid transparent",
                padding: "0.55rem 0.75rem 0.45rem",
                marginRight: "0.35rem",
              })}
            >
              <Text
                fontFamily="mono"
                fontSize="10px"
                letterSpacing="0.12em"
                textTransform="uppercase"
              >
                {label}
              </Text>
            </NavLink>
          ))}
        </HStack>
      </Box>
    </Box>
  );
}
