import axe from "axe-core";

import type {
  AuditMessage,
  AuditResult,
  HeadingInfo,
  ImageInfo,
  Issue,
  LinkInfo,
  MetadataInfo,
} from "@/types/audit";

let listenerRegistered = false;

export default defineContentScript({
  main() {
    if (listenerRegistered) {
      return;
    }

    const messageListener = (
      message: AuditMessage,
      _sender: unknown,
      sendResponse: (response: AuditResult) => void
    ) => {
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
              metadata: {
                title: null,
                description: null,
                canonical: null,
                lang: null,
                keywords: null,
                author: null,
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
              },
            });
          }
        })();
        return true;
      }
      return false;
    };

    browser.runtime.onMessage.addListener(messageListener);
    listenerRegistered = true;
  },
  matches: ["http://*/*", "https://*/*"],
});

async function runAudit(): Promise<AuditResult> {
  const accessibility = await axe.run(document);

  const issues: Issue[] = [];

  const accessibilityIssues = accessibility.violations
    .filter((v) => v.impact === "critical" || v.impact === "serious")
    .map((v) => ({
      type: "accessibility" as const,
      severity: v.impact as "critical" | "serious",
      id: v.id,
      title: v.help,
      description: v.description,
      helpUrl: v.helpUrl,
    }));

  issues.push(...accessibilityIssues);

  const metadata = collectMetadata();

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

  return { accessibility, issues, metadata, headings, images, links };
}

function collectMetadata(): MetadataInfo {
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

  return {
    title: titleText,
    description,
    canonical: canonicalUrl,
    lang,
    keywords,
    author,
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
      severity: "critical",
      id: "seo-missing-title",
      title: "Missing page title",
      description:
        "Page is missing a <title> tag. Title is crucial for SEO and user experience.",
    });
  } else if (metadata.title.length < 30) {
    issues.push({
      type: "seo",
      severity: "serious",
      id: "seo-title-too-short",
      title: "Page title too short",
      description: `Title is only ${metadata.title.length} characters. Recommended: 50-60 characters for optimal SEO.`,
    });
  } else if (metadata.title.length > 60) {
    issues.push({
      type: "seo",
      severity: "serious",
      id: "seo-title-too-long",
      title: "Page title too long",
      description: `Title is ${metadata.title.length} characters. It may be truncated in search results (recommended: 50-60 characters).`,
    });
  }

  if (!metadata.description) {
    issues.push({
      type: "seo",
      severity: "critical",
      id: "seo-missing-description",
      title: "Missing meta description",
      description:
        "Page is missing a meta description. This affects click-through rates from search results.",
    });
  } else if (metadata.description.length < 120) {
    issues.push({
      type: "seo",
      severity: "serious",
      id: "seo-description-too-short",
      title: "Meta description too short",
      description: `Description is only ${metadata.description.length} characters. Recommended: 150-160 characters.`,
    });
  } else if (metadata.description.length > 160) {
    issues.push({
      type: "seo",
      severity: "serious",
      id: "seo-description-too-long",
      title: "Meta description too long",
      description: `Description is ${metadata.description.length} characters. It may be truncated in search results (recommended: 150-160 characters).`,
    });
  }

  if (!metadata.canonical) {
    issues.push({
      type: "seo",
      severity: "serious",
      id: "seo-missing-canonical",
      title: "Missing canonical URL",
      description:
        "Page doesn't have a canonical URL. This can lead to duplicate content issues.",
    });
  }

  if (!metadata.lang) {
    issues.push({
      type: "seo",
      severity: "critical",
      id: "seo-missing-lang",
      title: "Missing language attribute",
      description:
        "The <html> element is missing a lang attribute. This affects accessibility and SEO.",
    });
  }

  if (!metadata.openGraph.title) {
    issues.push({
      type: "seo",
      severity: "serious",
      id: "seo-missing-og-title",
      title: "Missing OpenGraph title",
      description:
        "Missing og:title tag. This affects how your page appears when shared on social media.",
    });
  }

  if (!metadata.openGraph.description) {
    issues.push({
      type: "seo",
      severity: "serious",
      id: "seo-missing-og-description",
      title: "Missing OpenGraph description",
      description:
        "Missing og:description tag. This affects social media previews.",
    });
  }

  if (!metadata.openGraph.image) {
    issues.push({
      type: "seo",
      severity: "serious",
      id: "seo-missing-og-image",
      title: "Missing OpenGraph image",
      description:
        "Missing og:image tag. Social media posts without images get less engagement.",
    });
  }

  if (!metadata.openGraph.url) {
    issues.push({
      type: "seo",
      severity: "serious",
      id: "seo-missing-og-url",
      title: "Missing OpenGraph URL",
      description:
        "Missing og:url tag. This should be the canonical URL of the page.",
    });
  }

  if (!metadata.openGraph.type) {
    issues.push({
      type: "seo",
      severity: "serious",
      id: "seo-missing-og-type",
      title: "Missing OpenGraph type",
      description:
        "Missing og:type tag. This helps social networks understand your content type.",
    });
  }

  if (!metadata.twitter.card) {
    issues.push({
      type: "seo",
      severity: "serious",
      id: "seo-missing-twitter-card",
      title: "Missing Twitter Card",
      description:
        "Missing twitter:card tag. This affects how your page appears on Twitter/X.",
    });
  }

  if (metadata.keywords) {
    const keywordCount = metadata.keywords.split(",").length;
    if (keywordCount > 10) {
      issues.push({
        type: "seo",
        severity: "serious",
        id: "seo-keyword-stuffing",
        title: "Potential keyword stuffing",
        description: `Found ${keywordCount} meta keywords. Meta keywords are largely ignored by search engines and excessive use may be seen as spam.`,
      });
    }
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

  const badAltPatterns = [
    /^image$/i,
    /^photo$/i,
    /^picture$/i,
    /^img$/i,
    /^icon$/i,
    /^logo$/i,
    /^\d+$/,
    /^(jpg|jpeg|png|gif|webp|svg)$/i,
    /\.(jpg|jpeg|png|gif|webp|svg)$/i,
  ];

  let missingAltCount = 0;
  let badAltCount = 0;

  for (const img of images) {
    if (!img.hasAlt) {
      missingAltCount += 1;
    } else if (img.alt && img.alt !== "") {
      const altText: string = img.alt;
      if (badAltPatterns.some((pattern) => pattern.test(altText))) {
        badAltCount += 1;
      }
    }
  }

  if (missingAltCount > 0) {
    issues.push({
      type: "accessibility",
      severity: "critical",
      id: "image-missing-alt",
      title: "Images missing alt attribute",
      description: `${missingAltCount} image(s) are missing alt attributes. All images must have alt attributes for accessibility.`,
    });
  }

  if (badAltCount > 0) {
    issues.push({
      type: "accessibility",
      severity: "serious",
      id: "image-bad-alt",
      title: "Images with poor alt text quality",
      description: `${badAltCount} image(s) have poor quality alt text (e.g., "image", "photo", filenames). Alt text should describe the image content meaningfully.`,
    });
  }

  return issues;
}

function auditHeadings(headings: HeadingInfo[]): Issue[] {
  const issues: Issue[] = [];

  if (headings.length === 0) {
    issues.push({
      type: "accessibility",
      severity: "serious",
      id: "heading-no-headings",
      title: "No headings found",
      description:
        "Page has no heading elements (h1-h6). Headings are important for accessibility and SEO.",
    });
    return issues;
  }

  const h1Count = headings.filter((h) => h.level === 1).length;

  if (h1Count === 0) {
    issues.push({
      type: "seo",
      severity: "critical",
      id: "heading-missing-h1",
      title: "Missing H1 heading",
      description:
        "Page is missing an h1 heading. Every page should have exactly one h1 for SEO and accessibility.",
    });
  } else if (h1Count > 1) {
    issues.push({
      type: "seo",
      severity: "serious",
      id: "heading-multiple-h1",
      title: "Multiple H1 headings",
      description: `Page has ${h1Count} h1 headings. There should be only one h1 per page for optimal SEO.`,
    });
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
      severity: "serious",
      id: "heading-hierarchy-skip",
      title: "Heading hierarchy skips detected",
      description:
        "Heading structure skips levels (e.g., h1 to h3). Headings should not skip levels for proper document structure and accessibility.",
    });
  }

  if (h1Count > 0 && headings[0].level !== 1) {
    issues.push({
      type: "accessibility",
      severity: "serious",
      id: "heading-first-not-h1",
      title: "First heading is not H1",
      description: `First heading on the page is h${headings[0].level}. The first heading should be an h1.`,
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
      severity: "serious",
      id: "link-empty-text",
      title: "Links with empty text",
      description: `${emptyTextCount} link(s) have no visible text. All links should have descriptive text for accessibility.`,
    });
  }

  return issues;
}
