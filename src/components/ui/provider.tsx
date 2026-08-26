"use client";

import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  defineConfig,
} from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/config/reactQuery";

const theme = defineConfig({
  theme: {
    tokens: {
      colors: {
        f1: {
          50: { value: "oklch(0.97 0.02 25)" },
          100: { value: "oklch(0.92 0.06 25)" },
          200: { value: "oklch(0.84 0.11 25)" },
          300: { value: "oklch(0.75 0.16 25)" },
          400: { value: "oklch(0.66 0.19 25)" },
          500: { value: "oklch(0.58 0.216 25)" },
          600: { value: "oklch(0.5 0.2 25)" },
          700: { value: "oklch(0.42 0.17 25)" },
          800: { value: "oklch(0.34 0.13 25)" },
          900: { value: "oklch(0.26 0.09 25)" },
          950: { value: "oklch(0.18 0.05 25)" },
        },
        primary: { value: "oklch(0.58 0.216 25)" },
        purple: { value: "oklch(0.62 0.23 305)" },
        fastest: { value: "oklch(0.62 0.23 305)" },
        personalBest: { value: "oklch(0.75 0.19 150)" },
        slower: { value: "oklch(0.85 0.03 265)" },
      },
      fonts: {
        body: {
          value: "Archivo, ui-sans-serif, sans-serif",
        },
        heading: {
          value: "Archivo, ui-sans-serif, sans-serif",
        },
        mono: {
          value: "Geist Mono, ui-monospace, monospace",
        },
      },
    },
  },
});

const system = createSystem(defaultConfig, theme);

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <QueryClientProvider client={queryClient}>
        <ColorModeProvider defaultTheme="dark" {...props} />
      </QueryClientProvider>
    </ChakraProvider>
  );
}
