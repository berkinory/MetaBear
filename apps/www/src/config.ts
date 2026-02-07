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
    description: "All-in-one SEO & Accessibility audits for websites",
    keywords: ["seo", "accessibility", "audit", "website", "tools"],
    language: "en-US",
    longTitle: "MetaBear | SEO & Accessibility Audit",
    ogLogo: "",
    title: "MetaBear",
    twitter: "@berkinory",
    website: env.PUBLIC_WWW_URL || "http://localhost:4001",
  },
};
