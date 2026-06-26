import { Button, Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function Menu() {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      justifyContent={{
        base: "center",
      }}
      gap={4}
    >
      <Button variant="outline" onClick={() => navigate("/")}>
        Home
      </Button>
      <Button variant="outline" onClick={() => navigate("/standings")}>
        Standings
      </Button>
    </Box>
  );
}
