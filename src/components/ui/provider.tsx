"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/config/reactQuery";

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <QueryClientProvider client={queryClient}>
        <ColorModeProvider {...props} />
      </QueryClientProvider>
    </ChakraProvider>
  );
}
