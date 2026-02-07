export type DateFormat =
  | "YYYY-MM-DD"
  | "MM-DD-YYYY"
  | "DD-MM-YYYY"
  | "MONTH DAY YYYY"
  | "DAY MONTH YYYY";

export interface SiteInfo {
  website: string;
  title: string;
  longTitle?: string;
  author: string;
  description: string;
  language: string;
  keywords: string[];
  twitter?: string;
  ogLogo?: string;
}

export type Theme = "dark" | "light" | "auto";

export interface GeneralSettings {
  theme: Theme;
  themeToggle: boolean;
}

export interface DateSettings {
  dateFormat: DateFormat;
  dateSeparator: string;
}

export interface PostSettings {
  readingTime: boolean;
  toc: boolean;
}

export interface ThemeConfig {
  site: SiteInfo;
  general: GeneralSettings;
  date: DateSettings;
  post: PostSettings;
}
