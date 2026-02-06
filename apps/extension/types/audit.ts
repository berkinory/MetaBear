import type { AxeResults } from "axe-core";

export type IssueType = "accessibility" | "seo" | "performance" | "security";
export type IssueSeverity = "high" | "medium";

export interface Issue {
  type: IssueType;
  severity: IssueSeverity;
  id: string;
  title: string;
  description: string;
  helpUrl?: string;
}

export interface HeadingInfo {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
}

export interface ImageInfo {
  src: string;
  alt: string | null;
  width: number;
  height: number;
  hasAlt: boolean;
  isBroken: boolean;
}

export interface LinkInfo {
  href: string;
  text: string;
  title: string | null;
  isExternal: boolean;
  hasNofollow: boolean;
}

export interface MetadataInfo {
  title: string | null;
  description: string | null;
  canonical: string | null;
  lang: string | null;
  keywords: string | null;
  author: string | null;
  robotsContent: string | null;
  robotsText: string | null;
  sitemapText: string | null;
  favicon: string | null;
  appleTouchIcon: string | null;
  wordCount: number;
  charCount: number;
  url: string;
  openGraph: {
    title: string | null;
    description: string | null;
    image: string | null;
    url: string | null;
    type: string | null;
    locale: string | null;
    siteName: string | null;
  };
  twitter: {
    card: string | null;
    title: string | null;
    description: string | null;
    image: string | null;
  };
  robots: {
    url: string;
    exists: boolean;
  };
  sitemaps: string[];
}

export interface AuditResult {
  accessibility: AxeResults | null;
  error?: string;
  issues: Issue[];
  metadata: MetadataInfo;
  headings: HeadingInfo[];
  images: ImageInfo[];
  links: LinkInfo[];
  score: number;
}

export interface AuditMessage {
  type: "RUN_AUDIT";
}

export interface ScrollToHeadingMessage {
  type: "SCROLL_TO_HEADING";
  index: number;
}

export interface TogglePanelMessage {
  type: "TOGGLE_PANEL";
}

export interface AuditForTabMessage {
  tabId: number;
  type: "RUN_AUDIT_FOR_TAB";
}

export interface AuditResponse {
  data?: AuditResult;
  error?: string;
  success: boolean;
}

export type Message =
  | AuditForTabMessage
  | AuditMessage
  | TogglePanelMessage
  | ScrollToHeadingMessage;
