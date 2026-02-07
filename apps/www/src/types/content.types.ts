import type { CollectionEntry } from "astro:content";

export interface ReadingTime {
  text: string;
  minutes: number;
  time: number;
  words: number;
}

export interface TOCItem {
  level: number;
  text: string;
  id: string;
  index: number;
}

export interface PostListProps {
  posts: CollectionEntry<"posts">[];
}
