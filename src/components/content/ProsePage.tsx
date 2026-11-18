import { AdBanner } from "@/components/AdBanner";
import type { SitePage } from "@/content/sitePages";
import { Box, Container, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { useEffect, type ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";

type ProsePageProps = {
  page: SitePage;
  children?: ReactNode;
};

export function ProsePage({ page, children }: ProsePageProps) {
  useEffect(() => {
    document.title = `${page.title} — F1 Status`;
  }, [page.title]);

  return (
    <Container maxW="3xl" px={{ base: 4, md: 6 }} py={{ base: 6, md: 10 }}>
      <Stack gap="6">
        <Stack gap="3">
          <Heading as="h1" size="2xl">
            {page.title}
          </Heading>
          {page.paragraphs.map((paragraph) => (
            <Text
              key={paragraph.slice(0, 48)}
              color="fg.muted"
              lineHeight="1.8"
            >
              {paragraph}
            </Text>
          ))}
        </Stack>

        {children}

        {page.related && page.related.length > 0 && (
          <Stack gap="2">
            <Heading as="h2" size="md">
              Continuar lendo
            </Heading>
            {page.related.map((item) => (
              <Link key={item.href} asChild color="f1.500">
                <RouterLink to={item.href}>{item.label}</RouterLink>
              </Link>
            ))}
          </Stack>
        )}

        <Box pt="2">
          <AdBanner />
        </Box>
      </Stack>
    </Container>
  );
}
