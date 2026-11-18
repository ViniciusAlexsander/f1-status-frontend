import { ProsePage } from "@/components/content/ProsePage";
import { getSitePage } from "@/content/sitePages";
import { Navigate, useParams } from "react-router-dom";

export function GuideArticlePage() {
  const { slug } = useParams();
  const page = getSitePage(`/guias/${slug ?? ""}`);

  if (!page || page.kind !== "article") {
    return <Navigate to="/guias" replace />;
  }

  return <ProsePage page={page} />;
}
