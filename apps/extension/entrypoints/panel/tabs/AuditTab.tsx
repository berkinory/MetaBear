/* oxlint-disable react/no-multi-comp */
import {
  BrowserIcon,
  Copy01Icon,
  DashboardSpeed01Icon,
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

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      <SiteRow loading={loading} metadata={result?.metadata ?? null} />
      <ScoreCard
        loading={loading}
        score={result?.score ?? null}
        issuesCount={result?.issues.length ?? null}
      />
      <IssuesCard loading={loading} issues={result?.issues ?? null} />
    </div>
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

  const getIssueIcon = (type: Issue["type"]) => {
    const icons: Record<Issue["type"], typeof SeoIcon> = {
      accessibility: UniversalAccessIcon,
      seo: SeoIcon,
      performance: DashboardSpeed01Icon,
      security: SecurityIcon,
    };

    return icons[type];
  };

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
