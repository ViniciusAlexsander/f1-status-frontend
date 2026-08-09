import type { IconType } from "react-icons";
import { RiHomeLine, RiTrophyLine } from "react-icons/ri";

export type NavItem = {
  label: string;
  path: string;
  end?: boolean;
  icon: IconType;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Início", path: "/", end: true, icon: RiHomeLine },
  { label: "Classificação", path: "/standings", icon: RiTrophyLine },
  // { label: "Ao vivo", path: "/live", icon: RiLiveLine },
];
