import type { HeadingInfo } from "@/types/audit";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface HeadingsTabProps {
  headings: HeadingInfo[] | null;
}

export function HeadingsTab({ headings }: HeadingsTabProps) {
  if (!headings) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">Headings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <HeadingRowSkeleton />
          <HeadingRowSkeleton />
          <HeadingRowSkeleton />
          <HeadingRowSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (headings.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">No headings found on this page</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-muted-foreground">Headings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {headings.map((heading, idx) => (
          <HeadingRow
            key={`${heading.level}-${idx}-${heading.text.slice(0, 20)}`}
            heading={heading}
            index={idx}
          />
        ))}
      </CardContent>
    </Card>
  );
}

function HeadingRow({
  heading,
  index,
}: {
  heading: HeadingInfo;
  index: number;
}) {
  const indent = (heading.level - 1) * 12;
  const levelTone: Record<number, string> = {
    1: "text-foreground/90",
    2: "text-foreground/80",
    3: "text-foreground/75",
    4: "text-foreground/70",
    5: "text-foreground/65",
    6: "text-foreground/60",
  };
  const levelBadgeTone: Record<number, string> = {
    1: "border-sky-400/40 bg-sky-400/10 text-sky-200",
    2: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
    3: "border-amber-400/40 bg-amber-400/10 text-amber-200",
    4: "border-white/10 bg-white/5 text-muted-foreground",
    5: "border-white/10 bg-white/5 text-muted-foreground",
    6: "border-white/10 bg-white/5 text-muted-foreground",
  };

  const handleJump = async () => {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab?.id) {
      return;
    }
    await browser.tabs.sendMessage(tab.id, {
      type: "SCROLL_TO_HEADING",
      index,
    });
  };

  return (
    <button
      type="button"
      onClick={async () => {
        await handleJump();
      }}
      className="flex w-full items-start gap-2 rounded-md px-2 py-1 text-left hover:bg-white/5 transition-colors"
      style={{ paddingLeft: `${indent + 6}px` }}
      aria-label={`Jump to heading ${heading.text}`}
    >
      <span
        className={`inline-flex h-5 w-7 flex-shrink-0 items-center justify-center rounded border text-[10px] font-semibold ${levelBadgeTone[heading.level] ?? levelBadgeTone[6]}`}
      >
        H{heading.level}
      </span>
      <span
        className={`flex-1 break-words text-sm font-normal leading-snug ${levelTone[heading.level] ?? "text-foreground/60"}`}
      >
        {heading.text}
      </span>
    </button>
  );
}

function HeadingRowSkeleton() {
  return (
    <div className="flex items-start gap-2 rounded-md px-2 py-1">
      <Skeleton className="h-5 w-7 rounded" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
}
