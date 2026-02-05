import axe from "axe-core";

import type {
  AuditMessage,
  AuditResult,
  HeadingInfo,
  ImageInfo,
  Issue,
  LinkInfo,
  MetadataInfo,
  ScrollToHeadingMessage,
  TogglePanelMessage,
} from "@/types/audit";

const CONTENT_SCRIPT_FLAG = "__metabear_content_script_ready__";
let listenerRegistered = false;
let panelMounted = false;
let panelRoot: HTMLDivElement | null = null;
let closeListenerRegistered = false;

const PANEL_CONTAINER_ID = "__metabear_panel__";
const PANEL_URL = browser.runtime.getURL("/panel.html");
const PANEL_ORIGIN = new URL(PANEL_URL).origin;

export default defineContentScript({
  main() {
    const globalScope = globalThis as typeof globalThis & {
      [CONTENT_SCRIPT_FLAG]?: boolean;
    };

    if (globalScope[CONTENT_SCRIPT_FLAG]) {
      return;
    }

    globalScope[CONTENT_SCRIPT_FLAG] = true;

    if (listenerRegistered) {
      return;
    }

    if (!closeListenerRegistered) {
      window.addEventListener("message", (event) => {
        if (!panelMounted) {
          return;
        }

        if (event.origin !== PANEL_ORIGIN) {
          return;
        }

        if (event.data?.type === "CLOSE_PANEL") {
          togglePanel();
        }
      });
      closeListenerRegistered = true;
    }

    const messageListener = (
      message: AuditMessage | TogglePanelMessage | ScrollToHeadingMessage,
      _sender: unknown,
      sendResponse: (response?: AuditResult) => void
    ) => {
      if (message.type === "TOGGLE_PANEL") {
        togglePanel();
        sendResponse();
        return false;
      }

      if (message.type === "RUN_AUDIT") {
        (async () => {
          try {
            const result = await runAudit();
            sendResponse(result);
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Unknown error";
            sendResponse({
              accessibility: null,
              error: errorMessage,
              issues: [],
              headings: [],
              images: [],
              links: [],
              score: 100,
              metadata: {
                title: null,
                description: null,
                canonical: null,
                lang: null,
                keywords: null,
                author: null,
                robotsContent: null,
                favicon: null,
                wordCount: 0,
                charCount: 0,
                url: "",
                openGraph: {
                  title: null,
                  description: null,
                  image: null,
                  url: null,
                  type: null,
                },
                twitter: {
                  card: null,
                  title: null,
                  description: null,
                  image: null,
                },
                robots: { url: "", exists: false },
                sitemaps: [],
              },
            });
          }
        })();
        return true;
      }

      if (message.type === "SCROLL_TO_HEADING") {
        const headings = [
          ...document.querySelectorAll("h1, h2, h3, h4, h5, h6"),
        ];
        const target = headings[message.index] as HTMLElement | undefined;
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        sendResponse();
        return false;
      }
      return false;
    };

    browser.runtime.onMessage.addListener(messageListener);
    listenerRegistered = true;
  },
  registration: "runtime",
});

function togglePanel(): void {
  if (panelMounted) {
    panelRoot?.remove();
    panelRoot = null;
    panelMounted = false;
    return;
  }

  const existing = document.getElementById(PANEL_CONTAINER_ID);
  if (existing) {
    existing.remove();
  }

  panelRoot = document.createElement("div");
  panelRoot.id = PANEL_CONTAINER_ID;
  panelRoot.setAttribute("aria-hidden", "false");
  panelRoot.style.position = "fixed";
  panelRoot.style.top = "12px";
  panelRoot.style.right = "12px";
  panelRoot.style.width = "360px";
  panelRoot.style.height = "600px";
  panelRoot.style.zIndex = "2147483647";
  panelRoot.style.borderRadius = "18px";
  panelRoot.style.overflow = "hidden";
  panelRoot.style.background = "transparent";

  const iframe = document.createElement("iframe");
  iframe.src = PANEL_URL;
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "0";
  iframe.style.display = "block";
  iframe.setAttribute("allowtransparency", "true");
  iframe.setAttribute("title", "MetaBear Panel");

  panelRoot.appendChild(iframe);
  document.documentElement.appendChild(panelRoot);
  panelMounted = true;
}

async function runAudit(): Promise<AuditResult> {
  const accessibility = await axe.run(document);

  const issues: Issue[] = [];

  const accessibilityIssues = accessibility.violations
    .filter((v) => v.impact === "critical" || v.impact === "serious")
    .map((v) => ({
      type: "accessibility" as const,
      severity: (v.impact === "critical" ? "high" : "medium") as
        | "high"
        | "medium",
      id: v.id,
      title: v.help,
      description: v.description,
      helpUrl: v.helpUrl,
    }));

  issues.push(...accessibilityIssues);

  const baseMetadata = collectMetadata();
  const { robots, sitemaps } = await checkRobotsAndSitemap();
  const metadata = { ...baseMetadata, robots, sitemaps };

  const headings = collectHeadings();

  const images = collectImages();

  const links = collectLinks();

  const seoIssues = auditSEO(metadata);
  issues.push(...seoIssues);

  const headingIssues = auditHeadings(headings);
  issues.push(...headingIssues);

  const imageIssues = auditImages(images);
  issues.push(...imageIssues);

  const linkIssues = auditLinks(links);
  issues.push(...linkIssues);

  const highCount = issues.filter((i) => i.severity === "high").length;
  const mediumCount = issues.filter((i) => i.severity === "medium").length;
  const score = Math.max(0, 100 - highCount * 6 - mediumCount * 5);

  return { accessibility, issues, metadata, headings, images, links, score };
}

function collectMetadata(): Omit<MetadataInfo, "robots" | "sitemaps"> {
  const title = document.querySelector("title");
  const titleText = title?.textContent?.trim() || null;

  const metaDesc = document.querySelector('meta[name="description"]');
  const description = metaDesc?.getAttribute("content")?.trim() || null;

  const canonical = document.querySelector('link[rel="canonical"]');
  const canonicalUrl = canonical?.getAttribute("href") || null;

  const lang = document.documentElement.getAttribute("lang") || null;

  const metaKeywords = document.querySelector('meta[name="keywords"]');
  const keywords = metaKeywords?.getAttribute("content") || null;

  const metaAuthor = document.querySelector('meta[name="author"]');
  const author = metaAuthor?.getAttribute("content") || null;

  const metaRobots = document.querySelector('meta[name="robots"]');
  const robotsContent = metaRobots?.getAttribute("content") || null;

  const faviconEl = document.querySelector(
    'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]'
  );
  const faviconHref = faviconEl?.getAttribute("href") || "/favicon.ico";
  const favicon = (() => {
    try {
      return new URL(faviconHref, document.baseURI).href;
    } catch {
      return null;
    }
  })();

  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector(
    'meta[property="og:description"]'
  );
  const ogImage = document.querySelector('meta[property="og:image"]');
  const ogUrl = document.querySelector('meta[property="og:url"]');
  const ogType = document.querySelector('meta[property="og:type"]');

  const twitterCard = document.querySelector('meta[name="twitter:card"]');
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  const twitterDescription = document.querySelector(
    'meta[name="twitter:description"]'
  );
  const twitterImage = document.querySelector('meta[name="twitter:image"]');

  const bodyText = document.body?.textContent?.trim() || "";
  const wordCount = bodyText ? bodyText.split(/\s+/).length : 0;
  const charCount = bodyText.length;

  return {
    title: titleText,
    description,
    canonical: canonicalUrl,
    lang,
    keywords,
    author,
    robotsContent,
    favicon,
    wordCount,
    charCount,
    url: document.URL,
    openGraph: {
      title: ogTitle?.getAttribute("content") || null,
      description: ogDescription?.getAttribute("content") || null,
      image: ogImage?.getAttribute("content") || null,
      url: ogUrl?.getAttribute("content") || null,
      type: ogType?.getAttribute("content") || null,
    },
    twitter: {
      card: twitterCard?.getAttribute("content") || null,
      title: twitterTitle?.getAttribute("content") || null,
      description: twitterDescription?.getAttribute("content") || null,
      image: twitterImage?.getAttribute("content") || null,
    },
  };
}

function auditSEO(metadata: MetadataInfo): Issue[] {
  const issues: Issue[] = [];

  if (!metadata.title) {
    issues.push({
      type: "seo",
      severity: "high",
      id: "seo-missing-title",
      title: "Missing Page Title",
      description: "No <title> tag found. Required for SEO and browser tabs.",
    });
  } else if (metadata.title.length < 40) {
    issues.push({
      type: "seo",
      severity: "high",
      id: "seo-title-too-short",
      title: "Short Page Title",
      description: `Title is ${metadata.title.length} characters. Recommended: 40–60 characters.`,
    });
  } else if (metadata.title.length > 60) {
    issues.push({
      type: "seo",
      severity: "high",
      id: "seo-title-too-long",
      title: "Long Page Title",
      description: `Title is ${metadata.title.length} characters. Recommended: 40–60 characters.`,
    });
  }

  if (!metadata.description) {
    issues.push({
      type: "seo",
      severity: "high",
      id: "seo-missing-description",
      title: "Missing Meta Description",
      description:
        "No meta description found. Affects click-through rate in search results.",
    });
  } else if (metadata.description.length < 100) {
    issues.push({
      type: "seo",
      severity: "high",
      id: "seo-description-too-short",
      title: "Short Meta Description",
      description: `Description is ${metadata.description.length} characters. Recommended: 100–150 characters.`,
    });
  } else if (metadata.description.length > 150) {
    issues.push({
      type: "seo",
      severity: "high",
      id: "seo-description-too-long",
      title: "Long Meta Description",
      description: `Description is ${metadata.description.length} characters. Recommended: 100–150 characters.`,
    });
  }

  if (!metadata.canonical) {
    issues.push({
      type: "seo",
      severity: "high",
      id: "seo-missing-canonical",
      title: "Missing Canonical",
      description: "No canonical URL. Can cause duplicate content issues.",
    });
  } else {
    try {
      const current = new URL(window.location.href);
      const canonical = new URL(metadata.canonical, window.location.href);
      if (
        current.origin + current.pathname !==
        canonical.origin + canonical.pathname
      ) {
        issues.push({
          type: "seo",
          severity: "medium",
          id: "seo-canonical-mismatch",
          title: "Canonical Mismatch",
          description:
            "Current and canonical URLs don't match. Update the canonical tag to reflect the primary URL.",
        });
      }
    } catch {
      // invalid canonical URL format
    }
  }

  if (!metadata.lang) {
    issues.push({
      type: "accessibility",
      severity: "medium",
      id: "seo-missing-lang",
      title: "Missing Lang Attribute",
      description: "No lang on <html>. Required for accessibility and SEO.",
    });
  }

  const missingOgTags: string[] = [];
  if (!metadata.openGraph.title) {
    missingOgTags.push("og:title");
  }
  if (!metadata.openGraph.description) {
    missingOgTags.push("og:description");
  }
  if (!metadata.openGraph.image) {
    missingOgTags.push("og:image");
  }

  if (missingOgTags.length > 0) {
    issues.push({
      type: "seo",
      severity: "medium",
      id: "seo-missing-og-tags",
      title: "Missing OG Tags",
      description: `Missing: ${missingOgTags.join(", ")}. Affects social media previews.`,
    });
  }

  if (metadata.wordCount < 100) {
    issues.push({
      type: "seo",
      severity: "high",
      id: "seo-thin-content",
      title: "Thin Content",
      description: `Only ${metadata.wordCount} words. Pages under 100 words may be seen as thin content.`,
    });
  }

  return issues;
}

function collectHeadings(): HeadingInfo[] {
  const headings: HeadingInfo[] = [];
  const headingElements = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

  for (const heading of headingElements) {
    const level = Number.parseInt(heading.tagName.substring(1)) as
      | 1
      | 2
      | 3
      | 4
      | 5
      | 6;
    const text = heading.textContent?.trim() || "";

    if (text) {
      headings.push({ level, text });
    }
  }

  return headings;
}

function collectImages(): ImageInfo[] {
  const images: ImageInfo[] = [];
  const imgElements = document.querySelectorAll("img");

  for (const img of imgElements) {
    const srcAttr =
      img.getAttribute("src") || img.getAttribute("data-src") || "";
    if (!srcAttr || srcAttr.trim() === "") {
      continue;
    }

    const { src } = img;

    if (src.startsWith("data:") && !src.startsWith("data:image/")) {
      continue;
    }

    let isValidUrl = true;
    try {
      const _url = new URL(src);
    } catch {
      isValidUrl = false;
    }

    if (!isValidUrl) {
      continue;
    }

    const alt = img.getAttribute("alt");
    const hasAlt = img.hasAttribute("alt");

    const width = img.naturalWidth || img.width || 0;
    const height = img.naturalHeight || img.height || 0;

    images.push({
      src,
      alt: alt || null,
      width,
      height,
      hasAlt,
    });
  }

  return images;
}

function auditImages(images: ImageInfo[]): Issue[] {
  const issues: Issue[] = [];

  if (images.length === 0) {
    return issues;
  }

  let missingAltCount = 0;

  for (const img of images) {
    if (!img.hasAlt) {
      missingAltCount += 1;
    }
  }

  if (missingAltCount > 0) {
    issues.push({
      type: "accessibility",
      severity: "medium",
      id: "image-missing-alt",
      title: "Missing Alt Text",
      description: `${missingAltCount} image(s) without alt text. Required for screen readers.`,
    });
  }

  return issues;
}

function auditHeadings(headings: HeadingInfo[]): Issue[] {
  const issues: Issue[] = [];

  if (headings.length === 0) {
    issues.push({
      type: "accessibility",
      severity: "medium",
      id: "heading-no-headings",
      title: "No Headings",
      description:
        "No h1–h6 elements found. Headings help structure and accessibility.",
    });
    return issues;
  }

  let hasSkip = false;
  for (let i = 1; i < headings.length; i += 1) {
    const currentLevel = headings[i].level;
    const previousLevel = headings[i - 1].level;
    const skip = currentLevel - previousLevel;

    if (skip > 1) {
      hasSkip = true;
      break;
    }
  }

  if (hasSkip) {
    issues.push({
      type: "accessibility",
      severity: "medium",
      id: "heading-hierarchy-skip",
      title: "Heading Level Skip",
      description:
        "Levels are skipped (e.g., h1 → h3). Keep heading levels sequential.",
    });
  }

  return issues;
}

function collectLinks(): LinkInfo[] {
  const links: LinkInfo[] = [];
  const linkElements = document.querySelectorAll("a[href]");

  for (const link of linkElements) {
    const href = link.getAttribute("href");
    if (!href || href.trim() === "" || href === "#") {
      continue;
    }

    const text =
      link.textContent?.trim() || link.getAttribute("aria-label")?.trim() || "";
    const title = link.getAttribute("title");
    const rel = link.getAttribute("rel") || "";

    let isExternal = false;
    try {
      const linkUrl = new URL(href, window.location.href);
      isExternal = linkUrl.origin !== window.location.origin;
    } catch {
      isExternal = false;
    }

    const hasNofollow = rel.split(/\s+/).includes("nofollow");

    links.push({
      href,
      text,
      title,
      isExternal,
      hasNofollow,
    });
  }

  return links;
}

function auditLinks(links: LinkInfo[]): Issue[] {
  const issues: Issue[] = [];

  if (links.length === 0) {
    return issues;
  }

  let emptyTextCount = 0;

  for (const link of links) {
    if (!link.text || link.text.trim() === "") {
      emptyTextCount += 1;
    }
  }

  if (emptyTextCount > 0) {
    issues.push({
      type: "accessibility",
      severity: "medium",
      id: "link-empty-text",
      title: "Empty Link Text",
      description: `${emptyTextCount} link(s) with no visible text. Add descriptive text for accessibility.`,
    });
  }

  return issues;
}

async function checkRobotsAndSitemap(): Promise<{
  robots: { url: string; exists: boolean };
  sitemaps: string[];
}> {
  const { origin } = document.location;
  const robotsUrl = `${origin}/robots.txt`;
  let robotsExists = false;
  let robotsText = "";
  const sitemaps: string[] = [];

  try {
    const response = await fetch(robotsUrl);
    robotsExists = response.ok;
    if (robotsExists) {
      robotsText = await response.text();
    }
  } catch {
    // robots.txt not accessible
  }

  try {
    const sitemapUrl = `${origin}/sitemap.xml`;
    const response = await fetch(sitemapUrl);
    if (response.ok) {
      const text = await response.text();
      const doc = new DOMParser().parseFromString(text, "application/xml");
      const locs = doc.querySelectorAll("sitemapindex loc");
      if (locs.length > 0) {
        for (const loc of locs) {
          const url = loc.textContent?.trim();
          if (url) {
            sitemaps.push(url);
          }
        }
      } else {
        sitemaps.push(sitemapUrl);
      }
    }
  } catch {
    // sitemap.xml not accessible
  }

  if (sitemaps.length === 0 && robotsText) {
    for (const line of robotsText.split("\n")) {
      const match = line.match(/^Sitemap:\s*(.+)$/i);
      if (match) {
        sitemaps.push(match[1].trim());
      }
    }
  }

  return { robots: { url: robotsUrl, exists: robotsExists }, sitemaps };
}
