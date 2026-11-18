import fs from "node:fs";
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";
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

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function prerenderStaticPages(): Plugin {
  return {
    name: "prerender-static-pages",
    apply: "build",
    closeBundle() {
      const dist = path.resolve("dist");
      const indexPath = path.join(dist, "index.html");
      const pagesPath = path.resolve("src/content/sitePages.json");

      if (!fs.existsSync(indexPath) || !fs.existsSync(pagesPath)) {
        return;
      }

      const index = fs.readFileSync(indexPath, "utf8");
      const env = loadEnv("production", process.cwd(), "VITE_");
      const siteUrl = (env.VITE_SITE_URL ?? "https://f1status.app").replace(
        /\/$/,
        "",
      );
      const payload = JSON.parse(fs.readFileSync(pagesPath, "utf8")) as {
        pages: Array<{
          path: string;
          kind?: string;
          title: string;
          description: string;
          paragraphs: string[];
        }>;
      };

      const appPaths = ["/", "/standings", "/live"];
      const contentPages = payload.pages.filter(
        (page) => page.kind !== "intro",
      );

      for (const page of contentPages) {
        const article = `<article><h1>${escapeHtml(page.title)}</h1>${page.paragraphs
          .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
          .join("")}</article>`;
        const html = index
          .replace(/<div id="root"><\/div>/, `<div id="root">${article}</div>`)
          .replace(
            /<title>[^<]*<\/title>/,
            `<title>${escapeHtml(page.title)}</title>`,
          )
          .replace(
            /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
            `<meta name="description" content="${escapeHtml(page.description)}" />`,
          );

        const relative = page.path === "/" ? "" : page.path.replace(/^\//, "");
        const outDir = relative ? path.join(dist, relative) : dist;
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.join(outDir, "index.html"), html);
      }

      const sitemapPaths = [
        ...appPaths,
        ...contentPages.map((page) => page.path),
      ];
      const urlEntries = [...new Set(sitemapPaths)]
        .map((pagePath) => {
          const loc =
            pagePath === "/" ? `${siteUrl}/` : `${siteUrl}${pagePath}`;
          return `  <url><loc>${loc}</loc></url>`;
        })
        .join("\n");

      fs.writeFileSync(
        path.join(dist, "sitemap.xml"),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`,
      );

      const robots = `User-agent: *\nAllow: /\n\nUser-agent: Mediapartners-Google\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
      fs.writeFileSync(path.join(dist, "robots.txt"), robots);
    },
  };
}

export default defineConfig({
  plugins: [
    geojsonModules(),
    react(),
    tsconfigPaths({ projects: ["./tsconfig.app.json"] }),
    prerenderStaticPages(),
  ],
});
