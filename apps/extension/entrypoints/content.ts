import type { AxeResults } from "axe-core";

import axe from "axe-core";

import type {
  AuditResult,
  HeadingInfo,
  ImageInfo,
  Issue,
  LinkInfo,
  Message,
  MetadataInfo,
} from "@/types/audit";

const CONTENT_SCRIPT_FLAG = "__metabear_content_script_ready__";
let listenerRegistered = false;
let panelMounted = false;
let panelRoot: HTMLDivElement | null = null;
let closeListenerRegistered = false;

const PANEL_CONTAINER_ID = "__metabear_panel__";
const PANEL_URL = browser.runtime.getURL("/panel.html");
const PANEL_ORIGIN = new URL(PANEL_URL).origin;

const EMPTY_AUDIT_RESULT: AuditResult = {
  accessibility: null,
  error: "Unknown error",
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
    robotsText: null,
    sitemapText: null,
    favicon: null,
    appleTouchIcon: null,
    wordCount: 0,
    charCount: 0,
    url: "",
    openGraph: {
      title: null,
      description: null,
      image: null,
      url: null,
      type: null,
      locale: null,
      siteName: null,
    },
    twitter: {
      card: null,
      title: null,
      description: null,
      image: null,
    },
    robots: { url: "", exists: false },
    sitemaps: [],
    jsonLd: [],
    hreflang: [],
  },
};

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
      message: Message,
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
              ...EMPTY_AUDIT_RESULT,
              error: errorMessage,
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
  panelRoot.style.width = "420px";
  panelRoot.style.height = "640px";
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
  let accessibility: AxeResults;

  try {
    accessibility = await axe.run(document, {
      runOnly: {
        type: "rule",
        values: [
          "color-contrast",
          "label",
          "button-name",
          "frame-title",
          "aria-allowed-attr",
          "aria-required-attr",
          "aria-valid-attr-value",
          "aria-hidden-focus",
          "meta-viewport",
          "html-has-lang",
          "valid-lang",
        ],
      },
    });
  } catch (error) {
    console.error("axe.run error:", error);
    accessibility = {
      violations: [],
      passes: [],
      incomplete: [],
      inapplicable: [],
    } as unknown as AxeResults;
  }

  const issues: Issue[] = [];

  const accessibilityIssues = accessibility.violations
    .filter((v) => v.impact === "critical" || v.impact === "serious")
    .map((v) => {
      const severity: Issue["severity"] =
        v.impact === "critical" ? "high" : "medium";
      return {
        type: "accessibility" as const,
        severity,
        id: v.id,
        title: v.help,
        description: v.description,
        helpUrl: v.helpUrl,
      };
    });

  issues.push(...accessibilityIssues);

  const baseMetadata = collectMetadata();
  const { robots, sitemaps, robotsText, sitemapText } =
    await checkRobotsAndSitemap();
  const metadata = {
    ...baseMetadata,
    robots,
    sitemaps,
    robotsText,
    sitemapText,
  };

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

  issues.sort((a, b) => {
    if (a.severity === "high" && b.severity === "medium") {
      return -1;
    }
    if (a.severity === "medium" && b.severity === "high") {
      return 1;
    }
    return 0;
  });

  const highCount = issues.filter((i) => i.severity === "high").length;
  const mediumCount = issues.filter((i) => i.severity === "medium").length;
  const score = Math.max(0, 100 - highCount * 6 - mediumCount * 5);

  return { accessibility, issues, metadata, headings, images, links, score };
}

function collectMetadata(): Omit<
  MetadataInfo,
  "robots" | "sitemaps" | "robotsText" | "sitemapText"
> {
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
    'link[rel="icon"], link[rel="shortcut icon"]'
  );
  const appleTouchEl = document.querySelector('link[rel="apple-touch-icon"]');
  const faviconHref = faviconEl?.getAttribute("href") || "/favicon.ico";
  const appleTouchHref = appleTouchEl?.getAttribute("href") || null;
  const favicon = (() => {
    try {
      return new URL(faviconHref, document.baseURI).href;
    } catch {
      return null;
    }
  })();
  const appleTouchIcon = appleTouchHref
    ? (() => {
        try {
          return new URL(appleTouchHref, document.baseURI).href;
        } catch {
          return null;
        }
      })()
    : null;

  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector(
    'meta[property="og:description"]'
  );
  const ogImage = document.querySelector('meta[property="og:image"]');
  const ogUrl = document.querySelector('meta[property="og:url"]');
  const ogType = document.querySelector('meta[property="og:type"]');
  const ogLocale = document.querySelector('meta[property="og:locale"]');
  const ogSiteName = document.querySelector('meta[property="og:site_name"]');

  const twitterCard = document.querySelector('meta[name="twitter:card"]');
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  const twitterDescription = document.querySelector(
    'meta[name="twitter:description"]'
  );
  const twitterImage = document.querySelector('meta[name="twitter:image"]');

  const bodyText = document.body?.textContent?.trim() || "";
  const wordCount = bodyText ? bodyText.split(/\s+/).length : 0;
  const charCount = bodyText.length;

  const jsonLdScripts = document.querySelectorAll(
    'script[type="application/ld+json"]'
  );
  const jsonLd: string[] = [];
  for (const script of jsonLdScripts) {
    const content = script.textContent?.trim();
    if (content) {
      jsonLd.push(content);
    }
  }

  const hreflangLinks = document.querySelectorAll(
    'link[rel="alternate"][hreflang]'
  );
  const hreflang: Array<{ lang: string; url: string }> = [];
  for (const link of hreflangLinks) {
    const lang = link.getAttribute("hreflang");
    const url = link.getAttribute("href");
    if (lang && url) {
      hreflang.push({ lang, url });
    }
  }

  return {
    title: titleText,
    description,
    canonical: canonicalUrl,
    lang,
    keywords,
    author,
    robotsContent,
    favicon,
    appleTouchIcon,
    wordCount,
    charCount,
    url: document.URL,
    openGraph: {
      title: ogTitle?.getAttribute("content") || null,
      description: ogDescription?.getAttribute("content") || null,
      image: ogImage?.getAttribute("content") || null,
      url: ogUrl?.getAttribute("content") || null,
      type: ogType?.getAttribute("content") || null,
      locale: ogLocale?.getAttribute("content") || null,
      siteName: ogSiteName?.getAttribute("content") || null,
    },
    twitter: {
      card: twitterCard?.getAttribute("content") || null,
      title: twitterTitle?.getAttribute("content") || null,
      description: twitterDescription?.getAttribute("content") || null,
      image: twitterImage?.getAttribute("content") || null,
    },
    jsonLd,
    hreflang,
  };
}

function auditSEO(metadata: MetadataInfo): Issue[] {
  const issues: Issue[] = [];

  if (!metadata.title) {
    issues.push({
      type: "seo",
      severity: "high",
      id: "seo-missing-title",
      title: "Missing page title",
      description:
        "The <title> tag is missing from the <head> section. Page titles are essential for SEO rankings and appear in browser tabs and search results.",
    });
  } else if (metadata.title.length < 40) {
    issues.push({
      type: "seo",
      severity: "high",
      id: "seo-title-too-short",
      title: `Short page title (${metadata.title.length} chars)`,
      description:
        "Page titles under 40 characters may not fully describe your content to search engines. Aim for 40-60 characters to maximize visibility in search results.",
    });
  } else if (metadata.title.length > 60) {
    issues.push({
      type: "seo",
      severity: "high",
      id: "seo-title-too-long",
      title: `Long page title (${metadata.title.length} chars)`,
      description:
        "Titles over 60 characters get truncated in search results. Keep it between 40-60 characters to ensure your full message appears.",
    });
  }

  if (!metadata.description) {
    issues.push({
      type: "seo",
      severity: "high",
      id: "seo-missing-description",
      title: "Missing meta description",
      description:
        "The meta description tag is missing. This summary text appears in search results and significantly impacts click-through rates. Add a compelling 100-150 character description.",
    });
  } else if (metadata.description.length < 100) {
    issues.push({
      type: "seo",
      severity: "high",
      id: "seo-description-too-short",
      title: `Short meta description (${metadata.description.length} chars)`,
      description:
        "Descriptions under 100 characters don't provide enough context for users in search results. Expand your description to 100-150 characters for better engagement.",
    });
  } else if (metadata.description.length > 150) {
    issues.push({
      type: "seo",
      severity: "high",
      id: "seo-description-too-long",
      title: `Long meta description (${metadata.description.length} chars)`,
      description:
        "Search engines truncate descriptions over 150 characters. Shorten your meta description to ensure the full message is visible to users.",
    });
  }

  if (!metadata.canonical) {
    issues.push({
      type: "seo",
      severity: "high",
      id: "seo-missing-canonical",
      title: "Missing canonical URL",
      description:
        "No canonical URL is set. Canonical tags tell search engines which version of a page is the primary one, preventing duplicate content penalties.",
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
          title: "Canonical URL doesn't match current page",
          description:
            "Your canonical URL points to a different page. This can confuse search engines about which page to index. Update the canonical tag to match your primary URL.",
        });
      }
    } catch {
      // invalid canonical URL format
    }
  }

  if (!metadata.robots.exists) {
    issues.push({
      type: "seo",
      severity: "medium",
      id: "seo-missing-robots",
      title: "Missing robots.txt file",
      description:
        "The robots.txt file controls how search engines crawl your site. Without it, you can't control which pages are indexed or set crawl rate limits.",
    });
  }

  if (metadata.sitemaps.length === 0) {
    issues.push({
      type: "seo",
      severity: "medium",
      id: "seo-missing-sitemap",
      title: "Missing sitemap.xml",
      description:
        "Sitemaps help search engines discover and index your pages efficiently. Without one, important pages might be missed or crawled less frequently.",
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
      title: `Missing OG tags`,
      description: `Missing tags: ${missingOgTags.join(", ")}. Open Graph tags control how your page appears when shared on social media platforms like Facebook, LinkedIn, and Twitter.`,
    });
  }

  if (metadata.wordCount < 100) {
    issues.push({
      type: "seo",
      severity: "high",
      id: "seo-thin-content",
      title: `Page has thin content (${metadata.wordCount} words)`,
      description:
        "Pages with less than 100 words are considered thin content by search engines and may rank poorly. Add more valuable, relevant content to improve SEO.",
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

const resolveImageUrl = (raw: string | null): string | null => {
  if (!raw) {
    return null;
  }
  const trimmed = raw.trim();
  if (trimmed === "") {
    return null;
  }
  if (trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
    return trimmed;
  }
  try {
    return new URL(trimmed, document.baseURI).href;
  } catch {
    return null;
  }
};

const pickSrcFromSet = (raw: string | null): string | null => {
  if (!raw) {
    return null;
  }
  const [firstCandidate] = raw.split(",");
  const trimmedCandidate = firstCandidate?.trim();
  if (!trimmedCandidate) {
    return null;
  }
  const [url] = trimmedCandidate.split(/\s+/);
  return url ? url.trim() : null;
};

function collectImages(): ImageInfo[] {
  const images: ImageInfo[] = [];
  const seenSrcs = new Set<string>();
  const imgElements = document.querySelectorAll("img");

  for (const img of imgElements) {
    const lazySrcAttr =
      img.getAttribute("data-src") ||
      img.getAttribute("data-lazy-src") ||
      img.getAttribute("data-original") ||
      img.getAttribute("data-actualsrc");
    const lazySrcsetAttr =
      img.getAttribute("data-srcset") || img.getAttribute("data-lazy-srcset");
    const rawSrcset = lazySrcsetAttr || img.getAttribute("srcset");
    const rawSrcsetUrl = pickSrcFromSet(rawSrcset);
    const rawSrcAttr = img.getAttribute("src");

    const candidateSrc =
      resolveImageUrl(lazySrcAttr) ||
      resolveImageUrl(rawSrcsetUrl) ||
      resolveImageUrl(rawSrcAttr);

    const currentSrc = img.currentSrc || img.src || "";
    const currentIsPlaceholder =
      currentSrc.trim() === "" ||
      currentSrc === document.baseURI ||
      currentSrc.startsWith("data:");
    const src = currentIsPlaceholder
      ? candidateSrc || resolveImageUrl(currentSrc)
      : resolveImageUrl(currentSrc);

    if (!src) {
      continue;
    }

    if (seenSrcs.has(src)) {
      continue;
    }

    if (src.startsWith("data:") && !src.startsWith("data:image/")) {
      continue;
    }

    if (src.startsWith("data:image/svg+xml")) {
      try {
        const svgContent = decodeURIComponent(src.slice(src.indexOf(",") + 1));
        const hasDrawing =
          /<(path|rect|circle|line|polygon|polyline|ellipse|text|image|use|g)\b/i.test(
            svgContent
          );
        if (!hasDrawing) {
          continue;
        }
      } catch {
        // If decoding fails, keep the image
      }
    }

    if (src.startsWith("data:image/") && src.length < 200) {
      continue;
    }

    if (!resolveImageUrl(src)) {
      continue;
    }

    seenSrcs.add(src);

    const alt = img.getAttribute("alt");
    const hasAlt = img.hasAttribute("alt");

    const widthAttr =
      Number.parseInt(img.getAttribute("width") || "0", 10) || 0;
    const heightAttr =
      Number.parseInt(img.getAttribute("height") || "0", 10) || 0;
    const width = img.naturalWidth || img.width || widthAttr || 0;
    const height = img.naturalHeight || img.height || heightAttr || 0;
    const hasLazySource = Boolean(lazySrcAttr || rawSrcset);

    if (!hasLazySource && width <= 10 && height <= 10) {
      continue;
    }

    if (img.getAttribute("aria-hidden") === "true") {
      continue;
    }

    const computedStyle = window.getComputedStyle(img);
    if (
      computedStyle.display === "none" ||
      computedStyle.visibility === "hidden" ||
      computedStyle.opacity === "0"
    ) {
      continue;
    }

    const isBroken = img.complete && img.naturalWidth === 0;

    images.push({
      src,
      alt: alt || null,
      width,
      height,
      hasAlt,
      isBroken,
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
  const brokenImages: string[] = [];

  for (const img of images) {
    if (!img.hasAlt) {
      missingAltCount += 1;
    }
    if (img.isBroken) {
      brokenImages.push(img.src);
    }
  }

  if (missingAltCount > 0) {
    const imageWord = missingAltCount === 1 ? "image" : "images";
    issues.push({
      type: "accessibility",
      severity: "medium",
      id: "image-missing-alt",
      title: `Missing alt text on ${missingAltCount} ${imageWord}`,
      description:
        "Alt text describes images for screen reader users and appears when images fail to load. It's essential for accessibility and helps search engines understand image content.",
    });
  }

  if (brokenImages.length > 0) {
    const imageCount = brokenImages.length;
    const imageWord = imageCount === 1 ? "image" : "images";
    issues.push({
      type: "accessibility",
      severity: "high",
      id: "image-broken",
      title: `${imageCount} broken ${imageWord} detected`,
      description:
        "These images failed to load, creating a poor user experience. Check that image URLs are correct, files exist, and permissions allow access.",
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
      title: "No heading tags found on page",
      description:
        "Headings (h1-h6) structure your content and help screen readers navigate. They also signal content hierarchy to search engines. Add heading tags to organize your content.",
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
      title: "Heading levels skip in hierarchy",
      description:
        "Jumping heading levels (e.g., h1 directly to h3) confuses screen reader users and breaks content structure. Use sequential heading levels to maintain proper document hierarchy.",
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
    if (/^javascript:/i.test(href.trim())) {
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
    const linkWord = emptyTextCount === 1 ? "link" : "links";
    issues.push({
      type: "accessibility",
      severity: "medium",
      id: "link-empty-text",
      title: `${emptyTextCount} ${linkWord} with no visible text`,
      description:
        "Links without text are invisible to screen readers, making navigation impossible for blind users. Add descriptive text or aria-label attributes to all links.",
    });
  }

  return issues;
}

async function checkRobotsAndSitemap(): Promise<{
  robots: { url: string; exists: boolean };
  sitemaps: string[];
  robotsText: string | null;
  sitemapText: string | null;
}> {
  const { origin } = document.location;
  const robotsUrl = `${origin}/robots.txt`;
  let robotsExists = false;
  let robotsText = "";
  let sitemapText = "";
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
      sitemapText = text;
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

  if (!sitemapText && sitemaps.length > 0) {
    try {
      const response = await fetch(sitemaps[0]);
      if (response.ok) {
        sitemapText = await response.text();
      }
    } catch {
      // sitemap not accessible
    }
  }

  return {
    robots: { url: robotsUrl, exists: robotsExists },
    sitemaps,
    robotsText: robotsText || null,
    sitemapText: sitemapText || null,
  };
}
