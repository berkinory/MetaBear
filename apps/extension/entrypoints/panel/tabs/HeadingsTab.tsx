import { LicenseNoIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { easeOut } from "motion";
import { motion } from "motion/react";

import type { HeadingInfo } from "@/types/audit";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const INDENT_STEP = 12;
const LEVEL_TONE: Record<number, string> = {
  1: "text-foreground/90",
  2: "text-foreground/80",
  3: "text-foreground/75",
  4: "text-foreground/70",
  5: "text-foreground/65",
  6: "text-foreground/60",
};
const LEVEL_BADGE_TONE: Record<number, string> = {
  1: "border-sky-400/40 bg-sky-400/10 text-sky-200",
  2: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
  3: "border-amber-400/40 bg-amber-400/10 text-amber-200",
  4: "border-white/10 bg-white/5 text-muted-foreground",
  5: "border-white/10 bg-white/5 text-muted-foreground",
  6: "border-white/10 bg-white/5 text-muted-foreground",
};

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: easeOut } },
};

interface HeadingsTabProps {
  headings: HeadingInfo[] | null;
}

export function HeadingsTab({ headings }: HeadingsTabProps) {
  const isLoading = headings === null;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">Headings</CardTitle>
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-muted-foreground">Headings</CardTitle>
        {headings.length > 0 && (
          <Badge variant="secondary" className="font-mono">
            {headings.length}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {headings.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
            <HugeiconsIcon
              icon={LicenseNoIcon}
              strokeWidth={2}
              className="size-6"
            />
            <span className="text-sm">No headings found</span>
          </div>
        )}
        {headings.length > 0 && (
          <motion.div
            className="space-y-2"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {headings.map((heading, idx) => (
              <motion.div
                key={`${heading.level}-${idx}-${heading.text.slice(0, 20)}`}
                variants={itemVariants}
              >
                <HeadingRow heading={heading} index={idx} />
              </motion.div>
            ))}
          </motion.div>
        )}
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
  const indent = (heading.level - 1) * INDENT_STEP;

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
        try {
          await handleJump();
        } catch {
          return;
        }
      }}
      className="flex w-full items-start gap-2 rounded-md px-2 py-1 text-left hover:bg-white/8 transition-colors"
      style={{ paddingLeft: `${indent + 6}px` }}
      aria-label={`Jump to heading ${heading.text}`}
    >
      <span
        className={`inline-flex h-5 w-7 flex-shrink-0 items-center justify-center rounded border text-[10px] font-semibold ${LEVEL_BADGE_TONE[heading.level] ?? LEVEL_BADGE_TONE[6]}`}
      >
        H{heading.level}
      </span>
      <span
        className={`flex-1 break-words text-sm font-normal leading-snug ${LEVEL_TONE[heading.level] ?? "text-foreground/60"}`}
      >
        {heading.text}
      </span>
    </button>
  );
}
