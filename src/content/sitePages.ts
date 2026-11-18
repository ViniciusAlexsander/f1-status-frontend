import sitePagesJson from "./sitePages.json";

export type SitePageRelated = {
  href: string;
  label: string;
};

export type SitePageKind = "article" | "hub";

export type SitePage = {
  path: string;
  kind: SitePageKind;
  title: string;
  description: string;
  paragraphs: string[];
  related?: SitePageRelated[];
};

export const sitePages = sitePagesJson.pages as SitePage[];

const pagesByPath = new Map(sitePages.map((page) => [page.path, page]));

export function getSitePage(path: string): SitePage | undefined {
  return pagesByPath.get(path);
}

export const GUIDE_PAGES = sitePages.filter((page) =>
  page.path.startsWith("/guias/"),
);

export const PRERENDER_PATHS = sitePages.map((page) => page.path);
