/* oxlint-disable react/no-multi-comp */
import {
  BrowserIcon,
  Copy01Icon,
  DashboardSpeed01Icon,
  FileExportIcon,
  LicenseNoIcon,
  SeoIcon,
  SecurityIcon,
  Tick02Icon,
  UniversalAccessIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

import type { AuditResult, Issue, MetadataInfo } from "@/types/audit";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ISSUE_ICON_BY_TYPE: Record<Issue["type"], typeof SeoIcon> = {
  accessibility: UniversalAccessIcon,
  seo: SeoIcon,
  performance: DashboardSpeed01Icon,
  security: SecurityIcon,
};

const EXPORT_FIELDS = [
  { key: "score", label: "SEO Score" },
  { key: "issues", label: "Issues" },
  { key: "metaTags", label: "Meta Tags" },
  { key: "headings", label: "Headings" },
  { key: "images", label: "Images" },
  { key: "links", label: "Links" },
  { key: "openGraph", label: "OpenGraph" },
] as const;

interface AuditTabProps {
  error: string | null;
  loading: boolean;
  result: AuditResult | null;
  isRestricted: boolean;
  onRetry: () => void;
}

function cleanUrl(url: string): string {
  return url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/+$/, "");
}

function formatUrl(url: string): string {
  const cleaned = cleanUrl(url);
  if (cleaned.length <= 30) {
    return cleaned;
  }
  return `${cleaned.slice(0, 30)}...`;
}

function toFileSafe(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function AuditTab({
  error,
  loading,
  result,
  isRestricted,
  onRetry,
}: AuditTabProps) {
  if (isRestricted) {
    return (
      <Card className="border-muted">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-6 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Cannot Audit This Page</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Audits cannot run on browser internal pages, extensions, or
                restricted sites.
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Try visiting a regular website
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
        <Button variant="secondary" onClick={onRetry} className="w-full">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <SiteRow loading={loading} metadata={result?.metadata ?? null} />
        <ExportDialog disabled={loading || !result} result={result} />
      </div>
      <ScoreCard
        loading={loading}
        score={result?.score ?? null}
        issuesCount={result?.issues.length ?? null}
      />
      <IssuesCard loading={loading} issues={result?.issues ?? null} />
    </div>
  );
}

function ExportDialog({
  disabled,
  result,
}: {
  disabled: boolean;
  result: AuditResult | null;
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState({
    score: true,
    issues: true,
    metaTags: true,
    headings: true,
    images: true,
    links: true,
    openGraph: true,
  });

  const hasSelection = Object.values(options).some(Boolean);
  const handleCheckedChange = (key: keyof typeof options, value: boolean) => {
    setOptions((current) => ({ ...current, [key]: value }));
  };

  const handleExport = () => {
    if (!result || !hasSelection) {
      return;
    }

    const { metadata } = result;
    const payload: Record<string, unknown> = {
      exportedAt: new Date().toISOString(),
      url: metadata.url,
    };

    if (options.score) {
      payload.seoScore = {
        score: result.score,
        issuesCount: result.issues.length,
      };
    }

    if (options.issues) {
      payload.issues = result.issues.map(({ id: _id, ...issue }) => issue);
    }

    if (options.metaTags) {
      payload.metaTags = {
        title: metadata.title,
        description: metadata.description,
        canonical: metadata.canonical,
        lang: metadata.lang,
        keywords: metadata.keywords,
        author: metadata.author,
        robotsContent: metadata.robotsContent,
        favicon: metadata.favicon,
        appleTouchIcon: metadata.appleTouchIcon,
        wordCount: metadata.wordCount,
        charCount: metadata.charCount,
        imagesCount: result.images.length,
        linksCount: result.links.length,
        url: metadata.url,
        robots: {
          ...metadata.robots,
          text: metadata.robotsText,
        },
        sitemap: {
          text: metadata.sitemapText,
          urls: metadata.sitemaps,
        },
      };
    }

    if (options.headings) {
      payload.headings = result.headings;
    }

    if (options.images) {
      payload.images = result.images;
    }

    if (options.links) {
      payload.links = result.links;
    }

    if (options.openGraph) {
      payload.openGraph = {
        ...metadata.openGraph,
        twitter: metadata.twitter,
      };
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const host = result.metadata?.url
      ? toFileSafe(cleanUrl(result.metadata.url))
      : "audit";
    anchor.href = url;
    anchor.download = `metabear-${host}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="gap-2"
        >
          <HugeiconsIcon
            icon={FileExportIcon}
            strokeWidth={2}
            className="size-4"
          />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Export Audit</DialogTitle>
          <DialogDescription>
            Choose which sections to include in the JSON export.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-2">
          {EXPORT_FIELDS.map((item) => {
            const id = `export-${item.key}`;
            const checked = options[item.key as keyof typeof options];
            return (
              <label
                key={item.key}
                htmlFor={id}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg border px-3 py-2 text-sm cursor-pointer transition-colors duration-150",
                  checked
                    ? "border-white/15 bg-white/8 text-foreground"
                    : "border-white/8 bg-transparent text-muted-foreground hover:border-white/12 hover:bg-white/3"
                )}
              >
                <Checkbox
                  id={id}
                  checked={checked}
                  onCheckedChange={(value) =>
                    handleCheckedChange(
                      item.key as keyof typeof options,
                      value === true
                    )
                  }
                />
                <span className="select-none">{item.label}</span>
              </label>
            );
          })}
        </div>
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={handleExport}
            disabled={!hasSelection}
            className="gap-2"
          >
            <HugeiconsIcon
              icon={FileExportIcon}
              strokeWidth={2}
              className="size-4"
            />
            Export JSON
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SiteRow({
  loading,
  metadata,
}: {
  loading: boolean;
  metadata: MetadataInfo | null;
}) {
  let content: React.ReactNode = null;
  const showSkeleton = loading || !metadata;
  const [faviconFailed, setFaviconFailed] = useState(false);

  if (showSkeleton) {
    content = (
      <>
        <Skeleton className="h-6 w-6 rounded" />
        <Skeleton className="h-4 w-44" />
      </>
    );
  } else {
    content = (
      <>
        {metadata.favicon && !faviconFailed ? (
          <img
            src={metadata.favicon}
            alt=""
            className="h-6 w-6 rounded object-cover"
            onError={() => {
              setFaviconFailed(true);
            }}
          />
        ) : (
          <span className="inline-flex h-6 w-6 items-center justify-center text-white/60">
            <HugeiconsIcon
              icon={BrowserIcon}
              strokeWidth={2}
              className="size-4"
            />
          </span>
        )}
        <span className="text-sm text-white/70 truncate">
          {formatUrl(metadata.url)}
        </span>
      </>
    );
  }

  return <div className="flex items-center gap-2.5 h-5">{content}</div>;
}

function getScoreColor(score: number): string {
  if (score >= 85) {
    return "#22c55e";
  }
  if (score >= 70) {
    return "#eab308";
  }
  if (score >= 60) {
    return "#f97316";
  }
  return "#ef4444";
}

const SCORE_ANIMATION_MS = 1000;

function ScoreCircle({
  score,
  showValue,
}: {
  score: number;
  showValue: boolean;
}) {
  const size = 88;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [animatedScore, setAnimatedScore] = useState(0);
  const scoreValue = useMotionValue(0);
  const strokeOffset = useTransform(
    scoreValue,
    (value) => circumference - (value / 100) * circumference
  );
  const numberLift = useMotionValue(0);
  const numberTranslate = useMotionTemplate`translateY(${numberLift}px)`;

  useEffect(() => {
    const target = showValue ? score : 0;
    const controls = animate(scoreValue, target, {
      duration: SCORE_ANIMATION_MS / 1000,
      ease: "easeInOut",
      onUpdate: (value) => {
        const rounded = Math.round(value);
        setAnimatedScore(rounded);
      },
    });

    animate(numberLift, [1, 0], {
      duration: SCORE_ANIMATION_MS / 1000,
      ease: "easeOut",
    });

    return () => {
      controls.stop();
    };
  }, [score, showValue, scoreValue, numberLift]);

  const color = showValue
    ? getScoreColor(animatedScore)
    : "rgba(255, 255, 255, 0.25)";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-white/10"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: strokeOffset }}
        />
      </svg>
      {showValue ? (
        <motion.span
          className="absolute inset-0 flex items-center justify-center text-2xl font-bold tabular-nums font-mono"
          style={{
            color,
            textShadow: "0 1px 10px rgba(0, 0, 0, 0.35)",
            transform: numberTranslate,
          }}
        >
          {animatedScore}
        </motion.span>
      ) : null}
    </div>
  );
}

function ScoreCard({
  loading,
  score,
  issuesCount,
}: {
  loading: boolean;
  score: number | null;
  issuesCount: number | null;
}) {
  const showValue = !loading && score !== null;
  const showIssues = !loading && issuesCount !== null;
  const issuesLabel = issuesCount === 1 ? "issue" : "issues";

  return (
    <Card>
      <CardContent className="py-3 min-h-[150px]">
        <div className="flex flex-col items-center gap-3">
          <span className="flex items-center gap-1 text-xs font-semibold tracking-wide text-muted-foreground">
            SEO Score
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label="SEO score info"
                  className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[10px] font-semibold text-white/70 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] transition hover:bg-white/10 hover:text-white"
                >
                  i
                </button>
              </TooltipTrigger>
              <TooltipContent className="font-sans" sideOffset={6}>
                Approximate score based on our checks.
              </TooltipContent>
            </Tooltip>
          </span>
          <ScoreCircle score={showValue ? score : 0} showValue={showValue} />
          <div className="h-3">
            {loading ? (
              <Skeleton className="h-3 w-20" />
            ) : (
              <span
                className="text-xs font-semibold tracking-wide text-muted-foreground"
                style={{ opacity: showIssues ? 1 : 0 }}
              >
                {issuesCount === 0
                  ? "No issues"
                  : `${issuesCount} ${issuesLabel}`}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
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

const buildPrompt = (issue: Issue) =>
  `This is a comment from MetaBear browser extension: ${issue.title}. ${issue.description} How can I resolve this? If you propose a fix, please make it concise.`;

function parseDescription(description: string) {
  const parts: React.ReactNode[] = [];
  const linkRegex = /<<([^|]+)\|([^>]+)>>/g;
  let lastIndex = 0;
  let match;
  let partIndex = 0;

  while ((match = linkRegex.exec(description)) !== null) {
    if (match.index > lastIndex) {
      const textContent = description.slice(lastIndex, match.index);
      parts.push(<span key={`text-${partIndex}`}>{textContent}</span>);
      partIndex += 1;
    }
    const [, text, url] = match;
    parts.push(
      <a
        key={`link-${partIndex}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:underline font-medium"
        onClick={(e) => e.stopPropagation()}
      >
        {text}
      </a>
    );
    partIndex += 1;
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < description.length) {
    const textContent = description.slice(lastIndex);
    parts.push(<span key={`text-${partIndex}`}>{textContent}</span>);
  }

  return parts.length > 0 ? parts : description;
}

function IssuesCard({
  loading,
  issues,
}: {
  loading: boolean;
  issues: Issue[] | null;
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const copiedTimeoutRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (copiedTimeoutRef.current) {
        window.clearTimeout(copiedTimeoutRef.current);
      }
    },
    []
  );

  const getIssueIcon = (type: Issue["type"]) => ISSUE_ICON_BY_TYPE[type];

  if (!loading && (!issues || issues.length === 0)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
            <HugeiconsIcon
              icon={LicenseNoIcon}
              strokeWidth={2}
              className="size-6"
            />
            <span className="text-sm">No issues found</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-muted-foreground">Issues</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading ? (
          <Card className="border border-white/10 bg-white/5">
            <CardContent className="space-y-2 py-0">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-full" />
            </CardContent>
          </Card>
        ) : (
          issues?.map((issue) => (
            <Card key={issue.id} className="border border-white/10 bg-white/5">
              <CardContent className="space-y-1 py-0">
                <div className="flex items-start justify-between gap-2">
                  <Badge
                    variant="secondary"
                    className={
                      issue.severity === "high"
                        ? "w-fit gap-1 select-none bg-red-500/15 text-red-200"
                        : "w-fit gap-1 select-none bg-orange-400/15 text-orange-200"
                    }
                  >
                    <HugeiconsIcon
                      icon={getIssueIcon(issue.type)}
                      strokeWidth={2}
                      className="size-3"
                    />
                    {issue.type === "seo"
                      ? "SEO"
                      : issue.type.charAt(0).toUpperCase() +
                        issue.type.slice(1)}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                    onClick={async () => {
                      await copyToClipboard(buildPrompt(issue));
                      setCopiedId(issue.id);
                      if (copiedTimeoutRef.current) {
                        window.clearTimeout(copiedTimeoutRef.current);
                      }
                      copiedTimeoutRef.current = window.setTimeout(() => {
                        setCopiedId(null);
                      }, 2500);
                    }}
                    aria-label="Copy prompt"
                  >
                    <HugeiconsIcon
                      icon={copiedId === issue.id ? Tick02Icon : Copy01Icon}
                      strokeWidth={2}
                      className={
                        copiedId === issue.id
                          ? "size-3.5 blur-[0.5px]"
                          : "size-3.5"
                      }
                    />
                  </Button>
                </div>
                <div className="text-sm font-medium text-foreground">
                  {issue.title}
                </div>
                <p className="text-xs text-muted-foreground">
                  {parseDescription(issue.description)}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
}
