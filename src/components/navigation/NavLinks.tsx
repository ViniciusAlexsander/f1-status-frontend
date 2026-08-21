import { NAV_ITEMS } from "@/config/navigation";
import { Button, HStack, Stack } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

type NavLinksProps = {
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
};

export function NavLinks({ variant, onNavigate }: NavLinksProps) {
  const links = NAV_ITEMS.map((item) => {
    const Icon = item.icon;

    return (
      <NavLink
        key={item.path}
        to={item.path}
        end={item.end}
        onClick={onNavigate}
        style={{
          textDecoration: "none",
          width: variant === "mobile" ? "100%" : undefined,
        }}
      >
        {({ isActive }) => (
          <Button
            variant={isActive ? "subtle" : "ghost"}
            colorPalette={isActive ? "teal" : "gray"}
            justifyContent={variant === "mobile" ? "flex-start" : "center"}
            minH={variant === "mobile" ? "44px" : undefined}
            w={variant === "mobile" ? "full" : undefined}
            px={variant === "mobile" ? 4 : 3}
            gap="2"
          >
            <Icon />
            {item.label}
          </Button>
        )}
      </NavLink>
    );
  });

  if (variant === "desktop") {
    return (
      <HStack gap="1" display={{ base: "none", md: "flex" }}>
        {links}
      </HStack>
    );
  }

  return (
    <Stack gap="1" align="stretch">
      {links}
    </Stack>
  );
}
