import type { APIRoute } from "astro";

import { themeConfig } from "@/config";

export const GET: APIRoute = () => {
  const robotsTxt = `
User-agent: *
Allow: /

Disallow: /_draft

Sitemap: ${themeConfig.site.website}/sitemap.xml
`.trim();

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
