/* oxlint-disable react/no-multi-comp */
import {
  Copy01Icon,
  LicenseNoIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { easeOut } from "motion";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import type { MetadataInfo } from "@/types/audit";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const TAB_TRIGGER_CLASSNAME =
  "flex h-8 flex-none items-center justify-center rounded-md px-2 text-xs text-white/60 transition-colors hover:bg-white/10 data-[state=active]:!text-white relative overflow-hidden";
const TAB_INDICATOR_TRANSITION = {
  type: "spring",
  stiffness: 520,
  damping: 38,
  mass: 0.7,
} as const;
const CONTENT_MOTION = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.3,
    ease: easeOut,
  },
};

interface MetadataTabProps {
  metadata: MetadataInfo | null;
  linkCount: number;
  imageCount: number;
}

export function MetadataTab({
  metadata,
  linkCount,
  imageCount,
}: MetadataTabProps) {
  if (!metadata) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
            <HugeiconsIcon
              icon={LicenseNoIcon}
              strokeWidth={2}
              className="size-6"
            />
            <span className="text-sm">No audit data yet.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <BasicMetaCard metadata={metadata} />
      <CountsCard
        metadata={metadata}
        linkCount={linkCount}
        imageCount={imageCount}
      />
      {metadata?.keywords && <KeywordsCard keywords={metadata.keywords} />}
      <RobotsCard
        robotsText={metadata?.robotsText ?? null}
        sitemapText={metadata?.sitemapText ?? null}
        robotsUrl={metadata?.robots.url ?? null}
        sitemapUrl={metadata?.sitemaps[0] ?? null}
      />
    </div>
  );
}

function BasicMetaCard({ metadata }: { metadata: MetadataInfo }) {
  const canonicalStatus = (() => {
    if (!metadata.canonical || !metadata.url) {
      return "missing";
    }
    return metadata.url === metadata.canonical ? "match" : "mismatch";
  })();
  return (
    <Card>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Title</span>
            <span className="font-mono">{(metadata.title ?? "").length}</span>
          </div>
          <Textarea
            value={metadata.title ?? ""}
            readOnly
            rows={2}
            className="resize-none text-sm text-foreground"
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Description</span>
            <span className="font-mono">
              {(metadata.description ?? "").length}
            </span>
          </div>
          <Textarea
            value={metadata.description ?? ""}
            readOnly
            rows={3}
            className="resize-none text-sm text-foreground"
          />
        </div>
        <div className="space-y-1">
          <div className="text-xs font-semibold text-muted-foreground">URL</div>
          <Input
            value={metadata.url ?? ""}
            readOnly
            className="text-sm text-foreground"
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Canonical URL</span>
            <span
              className={
                canonicalStatus === "match" ? "text-green-500" : "text-red-500"
              }
            >
              {canonicalStatus === "match" ? "✓" : "✗"}
            </span>
          </div>
          <Input
            value={metadata.canonical ?? ""}
            readOnly
            className="text-sm text-foreground"
          />
        </div>
        <div className="space-y-1">
          <div className="text-xs font-semibold text-muted-foreground">
            Language
          </div>
          <Input
            value={metadata.lang ?? ""}
            readOnly
            className="text-sm text-foreground"
          />
        </div>
        <div className="space-y-1">
          <div className="text-xs font-semibold text-muted-foreground">
            Robots Tag
          </div>
          <Input
            value={metadata.robotsContent ?? ""}
            readOnly
            className="text-sm text-foreground"
          />
        </div>
        <div className="pt-1" />
      </CardContent>
    </Card>
  );
}

function openUrl(url: string) {
  try {
    const { protocol } = new URL(url);
    if (protocol === "http:" || protocol === "https:") {
      window.open(url, "_blank");
    }
  } catch {
    // invalid URL
  }
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    // Fallback
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  if (document.queryCommandSupported?.("copy")) {
    try {
      document.execCommand("copy");
    } catch {
      // Fallback failed
    }
  }
  textarea.remove();
};

function CountsCard({
  metadata,
  linkCount,
  imageCount,
}: {
  metadata: MetadataInfo;
  linkCount: number;
  imageCount: number;
}) {
  return (
    <Card>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span>Words</span>
          <span className="text-foreground font-mono">
            {metadata.wordCount.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span>Characters</span>
          <span className="text-foreground font-mono">
            {metadata.charCount.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span>Links</span>
          <span className="text-foreground font-mono">
            {linkCount.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span>Images</span>
          <span className="text-foreground font-mono">
            {imageCount.toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function KeywordsCard({ keywords }: { keywords: string }) {
  const keywordList = keywords.split(",").map((k) => k.trim());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-muted-foreground">Keywords</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {keywordList.map((keyword) => (
            <motion.span
              key={keyword}
              className="px-2 py-1 text-xs bg-muted rounded-md border border-transparent cursor-default select-none transition-colors hover:border-white/15 hover:bg-white/8"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {keyword}
            </motion.span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RobotsCard({
  robotsText,
  sitemapText,
  robotsUrl,
  sitemapUrl,
}: {
  robotsText: string | null;
  sitemapText: string | null;
  robotsUrl: string | null;
  sitemapUrl: string | null;
}) {
  const rawValue = robotsText ?? "";
  const sitemapValue = sitemapText ?? "";
  const [activeTab, setActiveTab] = useState("robots");
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const copiedTimeoutRef = useRef<number | null>(null);
  const hasRobots = Boolean(rawValue);
  const hasSitemap = Boolean(sitemapValue);

  useEffect(
    () => () => {
      if (copiedTimeoutRef.current) {
        window.clearTimeout(copiedTimeoutRef.current);
      }
    },
    []
  );

  const openSelected = () => {
    const url = activeTab === "robots" ? robotsUrl : sitemapUrl;
    if (url) {
      openUrl(url);
    }
  };

  const copySelected = async () => {
    const text = activeTab === "robots" ? rawValue : sitemapValue;
    await copyToClipboard(text);
    setCopiedTab(activeTab);
    if (copiedTimeoutRef.current) {
      window.clearTimeout(copiedTimeoutRef.current);
    }
    copiedTimeoutRef.current = window.setTimeout(() => {
      setCopiedTab(null);
    }, 2000);
  };

  const renderRobotsText = () => {
    if (!rawValue) {
      return <div className="text-muted-foreground">robots.txt not found.</div>;
    }

    return rawValue.split("\n").map((line, index) => {
      const trimmed = line.trim();
      const match = trimmed.match(/^(Allow|Disallow)\s*:(.*)$/i);
      const uaMatch = trimmed.match(/^(User-agent)\s*:(.*)$/i);

      if (uaMatch) {
        return (
          <div key={`robots-${index}-ua`} className="flex flex-wrap gap-2">
            <span className="text-purple-400">{uaMatch[1]}:</span>
            <span>{(uaMatch[2] ?? "").trim()}</span>
          </div>
        );
      }

      if (!match) {
        return <div key={`robots-${index}`}>{line || " "}</div>;
      }

      const label = match[1].toLowerCase();
      const value = match[2] ?? "";

      return (
        <div key={`robots-${index}-${label}`} className="flex flex-wrap gap-2">
          <span
            className={label === "allow" ? "text-emerald-400" : "text-red-400"}
          >
            {match[1]}:
          </span>
          <span>{value.trim()}</span>
        </div>
      );
    });
  };

  const renderSitemapXml = () => {
    if (!sitemapValue) {
      return (
        <div className="text-muted-foreground">sitemap.xml not found.</div>
      );
    }

    const tokens: React.ReactNode[] = [];
    const regex = /(<\/?[^>]+>)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null = null;
    let key = 0;

    while ((match = regex.exec(sitemapValue)) !== null) {
      if (match.index > lastIndex) {
        tokens.push(
          <span key={`text-${key}`}>
            {sitemapValue.slice(lastIndex, match.index)}
          </span>
        );
        key += 1;
      }

      const [, tag] = match;
      const parts = tag.match(/^<\/?([\w:-]+)([^>]*)>/);
      if (!parts) {
        tokens.push(
          <span key={`tag-${key}`} className="text-blue-300">
            {tag}
          </span>
        );
        key += 1;
      } else {
        const isClosing = tag.startsWith("</");
        const [, tagName, attrs = ""] = parts;

        tokens.push(
          <span key={`tag-${key}`} className="text-blue-300">
            {isClosing ? "</" : "<"}
          </span>
        );
        key += 1;
        tokens.push(
          <span key={`name-${key}`} className="text-cyan-300">
            {tagName}
          </span>
        );
        key += 1;
        if (attrs) {
          tokens.push(
            <span key={`attrs-${key}`} className="text-amber-300">
              {attrs}
            </span>
          );
          key += 1;
        }
        tokens.push(
          <span key={`end-${key}`} className="text-blue-300">
            {isClosing ? ">" : ">"}
          </span>
        );
        key += 1;
      }

      lastIndex = match.index + tag.length;
    }

    if (lastIndex < sitemapValue.length) {
      tokens.push(
        <span key={`text-${key}`}>{sitemapValue.slice(lastIndex)}</span>
      );
    }

    return tokens;
  };

  const renderHeaderActions = () => {
    const hasContent = activeTab === "robots" ? hasRobots : hasSitemap;
    const isDisabled = activeTab === "robots" ? !robotsUrl : !sitemapUrl;
    if (!hasContent) {
      return null;
    }

    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={copySelected}
          className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
          aria-label="Copy content"
        >
          <HugeiconsIcon
            icon={copiedTab === activeTab ? Tick02Icon : Copy01Icon}
            strokeWidth={2}
            className="size-3.5"
          />
        </button>
        <button
          type="button"
          onClick={openSelected}
          disabled={isDisabled}
          className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>Open</span>
          <span className="text-foreground">↗</span>
        </button>
      </div>
    );
  };

  const renderRobotsContent = () => {
    if (!hasRobots) {
      return (
        <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
          <HugeiconsIcon
            icon={LicenseNoIcon}
            strokeWidth={2}
            className="size-6"
          />
          <span className="text-sm">No robots.txt found</span>
        </div>
      );
    }
    return (
      <div className="max-w-full rounded-lg border border-white/10 bg-white/5 p-3 text-xs font-mono text-foreground whitespace-pre-wrap break-all">
        {renderRobotsText()}
      </div>
    );
  };

  const renderSitemapContent = () => {
    if (!hasSitemap) {
      return (
        <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
          <HugeiconsIcon
            icon={LicenseNoIcon}
            strokeWidth={2}
            className="size-6"
          />
          <span className="text-sm">No sitemap.xml found</span>
        </div>
      );
    }
    return (
      <div className="max-w-full rounded-lg border border-white/10 bg-white/5 p-3 text-xs font-mono text-foreground whitespace-pre-wrap break-all">
        {renderSitemapXml()}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-muted-foreground">
          Robots & Sitemap
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Tabs
          value={activeTab}
          className="flex flex-col gap-3"
          onValueChange={setActiveTab}
        >
          <div className="flex items-center justify-between gap-2">
            <TabsList variant="line" className="w-full justify-start">
              <TabsTrigger value="robots" className={TAB_TRIGGER_CLASSNAME}>
                {activeTab === "robots" && (
                  <motion.span
                    layoutId="metadata-tab-indicator"
                    className="absolute inset-0 rounded-md bg-white/20"
                    transition={TAB_INDICATOR_TRANSITION}
                  />
                )}
                <span className="relative z-10">Robots</span>
              </TabsTrigger>
              <TabsTrigger value="sitemap" className={TAB_TRIGGER_CLASSNAME}>
                {activeTab === "sitemap" && (
                  <motion.span
                    layoutId="metadata-tab-indicator"
                    className="absolute inset-0 rounded-md bg-white/20"
                    transition={TAB_INDICATOR_TRANSITION}
                  />
                )}
                <span className="relative z-10">Sitemap</span>
              </TabsTrigger>
            </TabsList>
            {renderHeaderActions()}
          </div>
          <TabsContent value="robots" className="min-h-[160px]">
            <motion.div
              initial={CONTENT_MOTION.initial}
              animate={CONTENT_MOTION.animate}
              transition={CONTENT_MOTION.transition}
            >
              {renderRobotsContent()}
            </motion.div>
          </TabsContent>
          <TabsContent value="sitemap" className="min-h-[160px]">
            <motion.div
              initial={CONTENT_MOTION.initial}
              animate={CONTENT_MOTION.animate}
              transition={CONTENT_MOTION.transition}
            >
              {renderSitemapContent()}
            </motion.div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
