import react from "@astrojs/react";
import playformInline from "@playform/inline";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import path from "node:path";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkDirective from "remark-directive";
import remarkMath from "remark-math";

import { themeConfig } from "./src/config";
import rehypeCleanup from "./src/plugins/rehype-cleanup.mjs";
import rehypeCopyCode from "./src/plugins/rehype-copy-code.mjs";
import rehypeImageProcessor from "./src/plugins/rehype-image-processor.mjs";
import remarkEmbeddedMedia from "./src/plugins/remark-embedded-media.mjs";
import remarkReadingTime from "./src/plugins/remark-reading-time.mjs";
import remarkTOC from "./src/plugins/remark-toc.mjs";
import { imageConfig } from "./src/utils/image-config";

export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  image: {
    service: {
      config: imageConfig,
      entrypoint: "astro/assets/services/sharp",
    },
  },
  integrations: [
    react(),
    playformInline({
      Exclude: [(file) => file.toLowerCase().includes("katex")],
    }),
  ],
  markdown: {
    rehypePlugins: [
      rehypeKatex,
      rehypeCleanup,
      rehypeImageProcessor,
      rehypeHighlight,
      rehypeCopyCode,
    ],
    remarkPlugins: [
      remarkMath,
      remarkDirective,
      remarkEmbeddedMedia,
      remarkReadingTime,
      remarkTOC,
    ],
    syntaxHighlight: false,
  },
  output: "static",
  site: themeConfig.site.website,
  trailingSlash: "never",
  vite: {
    // @ts-expect-error - Vite plugin version mismatch between Astro and Tailwind
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve("./src"),
      },
    },
  },
});
