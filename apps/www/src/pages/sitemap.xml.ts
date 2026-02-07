import type { APIRoute } from "astro";
import type { CollectionEntry } from "astro:content";

import { getCollection } from "astro:content";

import { themeConfig } from "@/config";

export const GET: APIRoute = async () => {
  const posts = await getCollection("posts");
  const publishedPosts = posts.filter(
    (post: CollectionEntry<"posts">) => !post.id.startsWith("_")
  );

  const baseUrl = themeConfig.site.website;

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
${publishedPosts
  .map(
    (post: CollectionEntry<"posts">) => `  <url>
    <loc>${baseUrl}/${post.id}/</loc>
    <lastmod>${post.data.updatedDate ? post.data.updatedDate.toISOString() : post.data.pubDate.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap.trim(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
