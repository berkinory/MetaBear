import type { CollectionEntry } from "astro:content";

import { getCollection } from "astro:content";

export const getFilteredPosts = async () => {
  const posts = await getCollection("posts");
  return posts.filter(
    (post: CollectionEntry<"posts">) => !post.id.startsWith("_")
  );
};

export const getSortedFilteredPosts = async () => {
  const posts = await getFilteredPosts();
  return posts.toSorted(
    (a: CollectionEntry<"posts">, b: CollectionEntry<"posts">) =>
      b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
};
