/* oxlint-disable react/no-multi-comp */
import type { MetadataInfo } from "@/types/audit";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

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
  const isLoading = !metadata;

  return (
    <div className="space-y-4">
      <BasicMetaCard metadata={metadata} loading={isLoading} />
      <CountsCard
        metadata={metadata}
        loading={isLoading}
        linkCount={linkCount}
        imageCount={imageCount}
      />
      {metadata?.keywords && <KeywordsCard keywords={metadata.keywords} />}
    </div>
  );
}

function BasicMetaCard({
  metadata,
  loading,
}: {
  metadata: MetadataInfo | null;
  loading: boolean;
}) {
  const canonicalStatus = (() => {
    if (loading) {
      return null;
    }
    if (!metadata?.canonical || !metadata?.url) {
      return "missing";
    }
    return metadata.url === metadata.canonical ? "match" : "mismatch";
  })();
  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Title</span>
            {loading ? (
              <Skeleton className="h-3 w-8" />
            ) : (
              <span className="font-mono">
                {(metadata?.title ?? "").length}
              </span>
            )}
          </div>
          {loading ? (
            <Skeleton className="h-14 w-full rounded-lg" />
          ) : (
            <Textarea
              value={metadata?.title ?? ""}
              readOnly
              rows={2}
              className="resize-none text-sm text-foreground"
            />
          )}
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Description</span>
            {loading ? (
              <Skeleton className="h-3 w-8" />
            ) : (
              <span className="font-mono">
                {(metadata?.description ?? "").length}
              </span>
            )}
          </div>
          {loading ? (
            <Skeleton className="h-20 w-full rounded-lg" />
          ) : (
            <Textarea
              value={metadata?.description ?? ""}
              readOnly
              rows={3}
              className="resize-none text-sm text-foreground"
            />
          )}
        </div>
        <div className="space-y-1">
          <div className="text-xs font-semibold text-muted-foreground">URL</div>
          {loading ? (
            <Skeleton className="h-8 w-full rounded-lg" />
          ) : (
            <Input
              value={metadata?.url ?? ""}
              readOnly
              className="text-sm text-foreground"
            />
          )}
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Canonical URL</span>
            {canonicalStatus === null ? (
              <Skeleton className="h-3 w-8" />
            ) : (
              <span
                className={
                  canonicalStatus === "match"
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {canonicalStatus === "match" ? "✓" : "✗"}
              </span>
            )}
          </div>
          {loading ? (
            <Skeleton className="h-8 w-full rounded-lg" />
          ) : (
            <Input
              value={metadata?.canonical ?? ""}
              readOnly
              className="text-sm text-foreground"
            />
          )}
        </div>
        <div className="space-y-1">
          <div className="text-xs font-semibold text-muted-foreground">
            Language
          </div>
          {loading ? (
            <Skeleton className="h-8 w-full rounded-lg" />
          ) : (
            <Input
              value={metadata?.lang ?? ""}
              readOnly
              className="text-sm text-foreground"
            />
          )}
        </div>
        <div className="space-y-1">
          <div className="text-xs font-semibold text-muted-foreground">
            Robots Tag
          </div>
          {loading ? (
            <Skeleton className="h-8 w-full rounded-lg" />
          ) : (
            <Input
              value={metadata?.robotsContent ?? ""}
              readOnly
              className="text-sm text-foreground"
            />
          )}
        </div>
        <div className="flex items-center justify-between pt-1">
          {loading ? (
            <>
              <Skeleton className="h-7 w-24 rounded-md" />
              <Skeleton className="h-7 w-24 rounded-md" />
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => openUrl(metadata?.robots.url ?? "")}
                className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
              >
                <span>robots.txt</span>
                <span className="text-foreground">↗</span>
              </button>
              <button
                type="button"
                onClick={() => openUrl(metadata?.sitemaps[0] || "")}
                className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
              >
                <span>sitemap.xml</span>
                <span className="text-foreground">↗</span>
              </button>
            </>
          )}
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

function CountsCard({
  metadata,
  loading,
  linkCount,
  imageCount,
}: {
  metadata: MetadataInfo | null;
  loading: boolean;
  linkCount: number;
  imageCount: number;
}) {
  return (
    <Card>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span>Words</span>
          {loading ? (
            <Skeleton className="h-3 w-10" />
          ) : (
            <span className="text-foreground font-mono">
              {metadata?.wordCount.toLocaleString() ?? "0"}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span>Characters</span>
          {loading ? (
            <Skeleton className="h-3 w-10" />
          ) : (
            <span className="text-foreground font-mono">
              {metadata?.charCount.toLocaleString() ?? "0"}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span>Links</span>
          {loading ? (
            <Skeleton className="h-3 w-10" />
          ) : (
            <span className="text-foreground font-mono">
              {linkCount.toLocaleString()}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span>Images</span>
          {loading ? (
            <Skeleton className="h-3 w-10" />
          ) : (
            <span className="text-foreground font-mono">
              {imageCount.toLocaleString()}
            </span>
          )}
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
