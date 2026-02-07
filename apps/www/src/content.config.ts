import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  loader: glob({ base: "./src/content/posts", pattern: "**/*.md" }),
  schema: z.object({
    category: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    pubDate: z.coerce.date(),
    show: z.boolean().optional().default(true),
    title: z.string(),
    updatedDate: z.coerce.date().optional(),
  }),
});

export const collections = { posts };
