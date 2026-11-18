import { AdBanner } from "@/components/AdBanner";
import type { SitePage } from "@/content/sitePages";
import { Heading, Stack, Text } from "@chakra-ui/react";

type PageIntroProps = {
  page: SitePage;
  showAd?: boolean;
};

export function PageIntro({ page, showAd = false }: PageIntroProps) {
  return (
    <Stack gap="3" maxW="3xl">
      <Heading as="h1" size="xl">
        {page.title}
      </Heading>
      {page.paragraphs.map((paragraph) => (
        <Text key={paragraph.slice(0, 48)} color="fg.muted" lineHeight="1.8">
          {paragraph}
        </Text>
      ))}
      {showAd ? <AdBanner /> : null}
    </Stack>
  );
}
