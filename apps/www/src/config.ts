import { env } from "@MetaBear/env/www";

import type { ThemeConfig } from "./types";

export const themeConfig: ThemeConfig = {
  date: {
    dateFormat: "DD-MM-YYYY",
    dateSeparator: "/",
  },

  general: {
    theme: "dark",
    themeToggle: false,
  },

  post: {
    readingTime: true,
    toc: true,
  },

  site: {
    author: "berkinory",
    description:
      "Professional SEO and accessibility auditing tool. Analyze your website's performance, fix issues, and boost search rankings with actionable insights.",
    keywords: [
      "seo audit",
      "website accessibility",
      "website analyzer",
      "seo tools",
      "meta tags checker",
    ],
    language: "en-US",
    longTitle: "MetaBear | Professional SEO & Accessibility Audit Tool",
    ogLogo: "logo.png",
    title: "MetaBear",
    twitter: "@berkinory",
    website: env.PUBLIC_WWW_URL || "http://localhost:4001",
  },
};
