import type { APIRoute, GetStaticPaths } from "astro";
import type { CollectionEntry } from "astro:content";

import { getCollection } from "astro:content";

import { generateOGImage } from "./_og";

export const prerender = true;

type OGVariant = "home" | "blog" | "post";

interface Props {
  postTitle?: string;
  variant: OGVariant;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("posts");

  const postPaths = posts
    .filter((post: CollectionEntry<"posts">) => !post.id.startsWith("_"))
    .map((post: CollectionEntry<"posts">) => ({
      params: { slug: `blog/${post.id}` },
      props: { postTitle: post.data.title, variant: "post" as const },
    }));

  return [
    { params: { slug: "blog" }, props: { variant: "blog" as const } },
    ...postPaths,
  ];
};

export const GET: APIRoute = async ({ props }) => {
  const { variant, postTitle } = props as Props;

  const png = await generateOGImage({
    postTitle,
    variant,
  });

  return new Response(Uint8Array.from(png), {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": "image/png",
    },
  });
};
