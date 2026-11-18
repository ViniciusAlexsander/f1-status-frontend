import { ProsePage } from "@/components/content/ProsePage";
import { CONTACT_EMAIL } from "@/config/site";
import { getSitePage } from "@/content/sitePages";
import { GuideIndexLinks } from "@/pages/content/GuideIndexLinks";
import NotFound from "@/pages/NotFound";
import { Link, Text } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

export function StaticContentPage() {
  const { pathname } = useLocation();
  const page = getSitePage(pathname);

  if (!page || (page.kind !== "article" && page.kind !== "hub")) {
    return <NotFound />;
  }

  const isContact = pathname === "/contato";
  const isHub = page.kind === "hub";

  return (
    <ProsePage page={page}>
      {isContact && (
        <Text>
          {CONTACT_EMAIL ? (
            <>
              E-mail:{" "}
              <Link href={`mailto:${CONTACT_EMAIL}`} color="f1.500">
                {CONTACT_EMAIL}
              </Link>
            </>
          ) : (
            "O e-mail de contato é definido na variável de ambiente VITE_CONTACT_EMAIL no deploy. Até lá, use a página Sobre para entender quem opera o site."
          )}
        </Text>
      )}
      {pathname === "/privacidade" && (
        <Text>
          Como o Google usa dados em sites de parceiros:{" "}
          <Link
            href="https://policies.google.com/technologies/partner-sites"
            color="f1.500"
            target="_blank"
            rel="noreferrer"
          >
            policies.google.com/technologies/partner-sites
          </Link>
          .
        </Text>
      )}
      {isHub ? <GuideIndexLinks /> : null}
    </ProsePage>
  );
}
