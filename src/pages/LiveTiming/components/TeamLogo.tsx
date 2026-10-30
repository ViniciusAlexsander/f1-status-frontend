import { getTeamLogo } from "@/api/teamLogos";

type TeamLogoProps = {
  teamName?: string;
};

export function TeamLogo({ teamName }: TeamLogoProps) {
  const logo = getTeamLogo(teamName);
  if (!logo) return null;

  return (
    <img
      src={logo}
      alt={`${teamName} logo`}
      style={{
        width: "36px",
        height: "32px",
        objectFit: "contain",
        flexShrink: 0,
      }}
    />
  );
}
