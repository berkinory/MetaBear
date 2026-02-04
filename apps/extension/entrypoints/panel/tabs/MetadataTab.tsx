/* oxlint-disable react/no-multi-comp */
import type { MetadataInfo } from "@/types/audit";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">No metadata available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <BasicMetaCard
        metadata={metadata}
        linkCount={linkCount}
        imageCount={imageCount}
      />
      <RobotsCard metadata={metadata} />
      {metadata.keywords && <KeywordsCard keywords={metadata.keywords} />}
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="space-y-1">
      <div className="text-xs font-semibold text-muted-foreground">{label}</div>
      <div className="text-sm break-all">
        {value ? (
          <span>{value}</span>
        ) : (
          <span className="text-muted-foreground italic">Not set</span>
        )}
      </div>
    </div>
  );
}

function BasicMetaCard({
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
      <CardHeader>
        <CardTitle>Basic Metadata</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <MetaRow label="URL" value={metadata.url} />
        <MetaRow label="Title" value={metadata.title} />
        <MetaRow label="Description" value={metadata.description} />
        <MetaRow label="Canonical URL" value={metadata.canonical} />
        <MetaRow label="Language" value={metadata.lang} />
        {metadata.author && <MetaRow label="Author" value={metadata.author} />}
        <div className="pt-3 border-t border-muted">
          <div className="grid grid-cols-4 gap-3">
            <div>
              <div className="text-xs font-semibold text-muted-foreground">
                Words
              </div>
              <div className="text-sm font-medium">
                {metadata.wordCount.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-muted-foreground">
                Chars
              </div>
              <div className="text-sm font-medium">
                {metadata.charCount.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-muted-foreground">
                Links
              </div>
              <div className="text-sm font-medium">
                {linkCount.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-muted-foreground">
                Images
              </div>
              <div className="text-sm font-medium">
                {imageCount.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
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

function getSitemapLabel(url: string) {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

function RobotsCard({ metadata }: { metadata: MetadataInfo }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Robots & Sitemap</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0.5">
        <button
          type="button"
          onClick={() => openUrl(metadata.robots.url)}
          className="flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-md hover:bg-muted transition-colors"
        >
          <span
            className={
              metadata.robots.exists ? "text-green-500" : "text-red-500"
            }
          >
            {metadata.robots.exists ? "✓" : "✗"}
          </span>
          <span className="text-sm flex-1">robots.txt</span>
          <span className="text-xs text-muted-foreground">↗</span>
        </button>
        {metadata.sitemaps.length > 0 ? (
          metadata.sitemaps.map((url) => (
            <button
              key={url}
              type="button"
              onClick={() => openUrl(url)}
              className="flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-md hover:bg-muted transition-colors"
            >
              <span className="text-green-500">✓</span>
              <span className="text-sm flex-1">{getSitemapLabel(url)}</span>
              <span className="text-xs text-muted-foreground">↗</span>
            </button>
          ))
        ) : (
          <div className="flex items-center gap-2 px-2 py-1.5">
            <span className="text-red-500">✗</span>
            <span className="text-sm text-muted-foreground">sitemap.xml</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function KeywordsCard({ keywords }: { keywords: string }) {
  const keywordList = keywords.split(",").map((k) => k.trim());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Keywords ({keywordList.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {keywordList.map((keyword) => (
            <span
              key={keyword}
              className="px-2 py-1 text-xs bg-muted rounded-md"
            >
              {keyword}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
