import alpineLogo from "@/assets/alpine-normalized-logo.avif";
import astonMartinLogo from "@/assets/aston-martin-normalized-logo.avif";
import audiLogo from "@/assets/audi-normalized-logo.avif";
import cadillacLogo from "@/assets/cadillac-normalized-logo.avif";
import ferrariLogo from "@/assets/ferrari-normalized-logo.avif";
import haasLogo from "@/assets/haas-normalized-logo.avif";
import mclarenLogo from "@/assets/mclaren-normalized-logo.avif";
import racingBullsLogo from "@/assets/rb-normalized-logo.avif";
import redBullLogo from "@/assets/rbr-normalized-logo.avif";
import mercedesLogo from "@/assets/2026-mercedes-normalized-logo.avif";
import williamsLogo from "@/assets/2026-williams-normalized-logo.avif";

const TEAM_LOGOS: Record<string, string> = {
  alpine: alpineLogo,
  "aston martin": astonMartinLogo,
  audi: audiLogo,
  cadillac: cadillacLogo,
  ferrari: ferrariLogo,
  haas: haasLogo,
  "haas f1 team": haasLogo,
  mclaren: mclarenLogo,
  "racing bulls": racingBullsLogo,
  "red bull racing": redBullLogo,
  mercedes: mercedesLogo,
  williams: williamsLogo,
};

export function getTeamLogo(teamName?: string): string | undefined {
  return teamName ? TEAM_LOGOS[teamName.trim().toLowerCase()] : undefined;
}
