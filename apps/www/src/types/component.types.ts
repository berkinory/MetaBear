import type { TOCItem, ReadingTime } from "./content.types";

export interface TOCProps {
  toc?: TOCItem[];
}

export interface PostLayoutProps {
  id: string;
  category?: string;
  description?: string;
  image?: string;
  keywords?: string[];
  pubDate: Date;
  readingTime?: ReadingTime;
  title: string;
  toc?: TOCItem[];
  updatedDate?: Date;
}

export interface TransitionProps {
  type: "post" | "page";
  class?: string;
}

export interface LayoutProps extends TransitionProps {
  title?: string;
  description?: string;
}

export interface BaseHeadProps {
  description: string;
  keywords?: string[];
  ogImage?: string;
  pubDate?: Date;
  robots?: string;
  title: string;
  type?: "website" | "article";
  updatedDate?: Date;
}

export interface ImageOptimizerProps {
  src: string | ImageMetadata;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: "avif" | "webp" | "jpeg" | "png";
  loading?: "lazy" | "eager";
  decoding?: "async" | "sync" | "auto";
  class?: string;
  caption?: string;
  priority?: boolean;
}

export interface FormattedDateProps {
  date: Date;
  format?: string;
  context?: "list" | "post" | "default";
}

export interface GitHubRepoData {
  owner?: {
    avatar_url: string;
  };
  description?: string;
  stargazers_count?: number;
  forks_count?: number;
  license?: {
    spdx_id: string;
  };
}

export interface CachedRepoData {
  data: GitHubRepoData;
  timestamp: number;
}

export interface CardElements {
  avatar: HTMLElement | null;
  desc: HTMLElement | null;
  stars: HTMLElement | null;
  forks: HTMLElement | null;
  license: HTMLElement | null;
}
