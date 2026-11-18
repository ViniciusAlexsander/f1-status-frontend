import type { IconType } from "react-icons";
import { RiHomeLine, RiRadioLine, RiTrophyLine } from "react-icons/ri";

export type NavItem = {
  label: string;
  path: string;
  end?: boolean;
  icon: IconType;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Início", path: "/", end: true, icon: RiHomeLine },
  { label: "Classificação", path: "/standings", icon: RiTrophyLine },
  { label: "Ao vivo", path: "/live", icon: RiRadioLine },
];

export const FOOTER_ITEMS: Array<{ label: string; path: string }> = [
  { label: "Sobre", path: "/sobre" },
  { label: "Como funciona", path: "/como-funciona" },
  { label: "Guias", path: "/guias" },
  { label: "Privacidade", path: "/privacidade" },
  { label: "Contato", path: "/contato" },
];

export const CONTENT_PATH_PREFIXES = [
  "/sobre",
  "/contato",
  "/privacidade",
  "/como-funciona",
  "/guias",
] as const;

export function isContentPath(pathname: string): boolean {
  return CONTENT_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
