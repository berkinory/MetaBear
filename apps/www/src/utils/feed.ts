import type { APIContext, ImageMetadata } from "astro";
import type { CollectionEntry } from "astro:content";

import { getImage } from "astro:assets";
import { getCollection } from "astro:content";
import { Feed } from "feed";
import MarkdownIt from "markdown-it";
import { parse as htmlParser } from "node-html-parser";
import path from "node:path";
import sanitizeHtml from "sanitize-html";

import { themeConfig } from "@/config";

const markdownParser = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

const imagesGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/content/posts/_assets/**/*.{jpeg,jpg,png,gif,webp}"
);

const fixRelativeImagePaths = async (
  htmlContent: string,
  baseUrl: string,
  postPath: string
): Promise<string> => {
  const root = htmlParser(htmlContent);
  const imageTags = root.querySelectorAll("img");
  const postDir = path.dirname(postPath);

  for (const img of imageTags) {
    const src = img.getAttribute("src");
    if (!src) {
      continue;
    }

    if (/^(https?:\/\/|\/\/)/.test(src)) {
      continue;
    }

    if (src.startsWith("./") || src.startsWith("../")) {
      let resolvedPath: string;
      if (src.startsWith("./")) {
        resolvedPath = path.posix.join(
          "/src/content/posts",
          postDir,
          src.slice(2)
        );
      } else {
        resolvedPath = path.posix.resolve("/src/content/posts", postDir, src);
      }

      const imageLoader = imagesGlob[resolvedPath];
      if (imageLoader) {
        try {
          const imageModule = await imageLoader();
          const metadata = imageModule.default;

          if (import.meta.env.DEV) {
            const relativePath = resolvedPath.replace(
              "/src/content/posts/",
              "/"
            );
            const imageUrl = new URL(relativePath, baseUrl).toString();
            img.setAttribute("src", imageUrl);
          } else {
            const processedImage = await getImage({
              format: "webp",
              src: metadata,
              width: 800,
            });

            img.setAttribute(
              "src",
              new URL(processedImage.src, baseUrl).toString()
            );
          }
        } catch (error) {
          console.error(
            `[Feed] Image processing failed: ${src} -> ${resolvedPath}`,
            error
          );
          const relativePath = resolvedPath.replace("/src/content/posts/", "/");
          const imageUrl = new URL(relativePath, baseUrl).toString();
          img.setAttribute("src", imageUrl);
        }
      } else {
        console.warn(`[Feed] Image module not found: ${resolvedPath}`);
        console.warn(
          `[Feed] Available image modules:`,
          Object.keys(imagesGlob)
        );
      }
    } else if (src.startsWith("/")) {
      img.setAttribute("src", new URL(src, baseUrl).toString());
    }
  }

  return root.toString();
};

const generateFeedInstance = async (context: APIContext) => {
  const siteUrl = (
    context.site?.toString() || themeConfig.site.website
  ).replace(/\/$/, "");
  const {
    title = "",
    description = "",
    author = "",
    language = "en-US",
  } = themeConfig.site;

  const feed = new Feed({
    author: {
      link: siteUrl,
      name: author,
    },
    description: description,
    feedLinks: {
      atom: `${siteUrl}/atom.xml`,
      rss: `${siteUrl}/rss.xml`,
    },
    generator: "Astro Chiri Feed Generator",
    id: siteUrl,
    language: language,
    link: siteUrl,
    title: title,
    updated: new Date(),
  });

  const posts = await getCollection(
    "posts",
    ({ id }: CollectionEntry<"posts">) => !id.startsWith("_")
  );
  const sortedPosts = posts.toSorted(
    (a: CollectionEntry<"posts">, b: CollectionEntry<"posts">) =>
      b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  for (const post of sortedPosts) {
    const postSlug = post.id.replace(/\.[^/.]+$/, "");
    const postUrl = new URL(postSlug, siteUrl).toString();
    const rawHtml = markdownParser.render(post.body || "");
    const processedHtml = await fixRelativeImagePaths(
      rawHtml,
      siteUrl,
      post.id
    );
    const cleanHtml = sanitizeHtml(processedHtml, {
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        "*": ["class", "id"],
        a: ["href", "title", "target", "rel"],
        img: ["src", "alt", "title", "width", "height"],
      },
      allowedTags: [...sanitizeHtml.defaults.allowedTags, "img", "div", "span"],
    });

    const plainText = sanitizeHtml(cleanHtml, {
      allowedAttributes: {},
      allowedTags: [],
    })
      .replace(/\s+/g, " ")
      .trim();
    const description =
      plainText.length > 200 ? `${plainText.slice(0, 200)}...` : plainText;

    feed.addItem({
      content: cleanHtml,
      date: post.data.pubDate,
      description: description,
      id: postUrl,
      link: postUrl,
      published: post.data.pubDate,
      title: post.data.title,
    });
  }

  return feed;
};

export const generateRSS = async (context: APIContext) => {
  const feed = await generateFeedInstance(context);
  const rssXml = feed
    .rss2()
    .replace(
      '<?xml version="1.0" encoding="utf-8"?>',
      '<?xml version="1.0" encoding="utf-8"?>\n<?xml-stylesheet type="text/xsl" href="/feeds/rss-style.xsl"?>'
    );
  return new Response(rssXml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
};

export const generateAtom = async (context: APIContext) => {
  const feed = await generateFeedInstance(context);
  const atomXml = feed
    .atom1()
    .replace(
      '<?xml version="1.0" encoding="utf-8"?>',
      '<?xml version="1.0" encoding="utf-8"?>\n<?xml-stylesheet type="text/xsl" href="/feeds/atom-style.xsl"?>'
    );
  return new Response(atomXml, {
    headers: { "Content-Type": "application/atom+xml; charset=utf-8" },
  });
};
