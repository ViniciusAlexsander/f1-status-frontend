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
import { Link as RouterLink } from "react-router-dom";

type SiteHeaderProps = {
  isLive: boolean;
  statusLabel: string;
  onToggleLive?: () => void;
};

export function SiteHeader({
  isLive,
  statusLabel,
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
      <Container maxW="1600px" py="3" px={{ base: 4, md: 6 }}>
        <Flex align="center" gap="4">
          <Link asChild _hover={{ textDecoration: "none" }}>
            <RouterLink to="/">
              <HStack minW="0" gap="3">
                <Box w="1.5" h="6" bg={isLive ? "f1.500" : "fg.muted"} />
                <Box lineHeight="1">
                  <Text
                    fontSize="sm"
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

          <HStack display={{ base: "none", lg: "flex" }} ml="4" gap="1">
            {[
              ["Ao vivo", "/live"],
              ["Próxima", "/#proxima"],
              ["Resultados", "/#resultados"],
            ].map(([label, href]) => (
              <Link
                key={href}
                asChild
                px="3"
                py="1.5"
                color="fg.muted"
                _hover={{
                  bg: "bg.subtle",
                  color: "fg",
                  textDecoration: "none",
                }}
                fontFamily="mono"
                fontSize="11px"
                letterSpacing="0.12em"
                textTransform="uppercase"
              >
                <RouterLink to={href}>{label}</RouterLink>
              </Link>
            ))}
          </HStack>

          <HStack ml="auto" gap={{ base: 2, md: 3 }}>
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
        display={{ base: "block", md: "none" }}
        borderTopWidth="1px"
        borderColor={isLive ? "f1.500/25" : "border"}
        px="4"
        py="1.5"
      >
        <Text
          fontFamily="mono"
          fontSize="10px"
          letterSpacing="0.12em"
          color={isLive ? "fg" : "fg.muted"}
          textTransform="uppercase"
        >
          {isLive ? "Sessão em pista" : "Sem sessão em pista"}
          <Text as="span" float="right" color="fg.muted">
            {statusLabel}
          </Text>
        </Text>
      </Box>
    </Box>
  );
}
