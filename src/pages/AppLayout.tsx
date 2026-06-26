import { Outlet } from "react-router-dom";
import { Menu } from "@/components/Menu";
import { Box } from "@chakra-ui/react";

export function AppLayout() {
  return (
    <Box px="4" py="8">
      <Box paddingBottom="4">
        <Menu />
      </Box>

      <Outlet />
    </Box>
  );
}
