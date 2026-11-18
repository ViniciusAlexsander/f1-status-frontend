import { getTeamLogo } from "@/api/teamLogos";
import { Image } from "@chakra-ui/react";

type TeamLogoProps = {
  teamName?: string;
};

export function TeamLogo({ teamName }: TeamLogoProps) {
  const logo = getTeamLogo(teamName);
  if (!logo) return null;

  return (
    <Image
      src={logo}
      alt={`${teamName} logo`}
      width={{ base: "28px", md: "36px" }}
      height={{ base: "25px", md: "32px" }}
      objectFit="contain"
      flexShrink="0"
    />
  );
}
