import { GUIDE_PAGES } from "@/content/sitePages";
import { Link, Stack, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export function GuideIndexLinks() {
  return (
    <Stack gap="4">
      {GUIDE_PAGES.map((guide) => (
        <Stack key={guide.path} gap="1">
          <Link asChild fontWeight="700" color="fg">
            <RouterLink to={guide.path}>{guide.title}</RouterLink>
          </Link>
          <Text color="fg.muted" fontSize="sm">
            {guide.description}
          </Text>
        </Stack>
      ))}
    </Stack>
  );
}
