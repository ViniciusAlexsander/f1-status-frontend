import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

function geojsonModules(): Plugin {
  return {
    name: "geojson-modules",
    transform(code, id) {
      if (id.split("?")[0].endsWith(".geojson")) {
        return { code: `export default ${code}`, map: null };
      }
    },
  };
}

export default defineConfig({
  plugins: [
    geojsonModules(),
    react(),
    tsconfigPaths({ projects: ["./tsconfig.app.json"] }),
  ],
});
