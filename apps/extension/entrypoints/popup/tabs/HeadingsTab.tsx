import type { HeadingInfo } from "@/types/audit";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HeadingsTabProps {
  headings: HeadingInfo[] | null;
}

export function HeadingsTab({ headings }: HeadingsTabProps) {
  if (!headings || headings.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">No headings found on this page</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Heading Structure ({headings.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {headings.map((heading, idx) => (
          <HeadingRow
            key={`${heading.level}-${idx}-${heading.text.slice(0, 20)}`}
            heading={heading}
          />
        ))}
      </CardContent>
    </Card>
  );
}

const getLevelStyle = (level: number) => {
  const styles: Record<
    number,
    { color: string; fontSize: string; weight: string }
  > = {
    1: {
      color: "text-foreground",
      fontSize: "text-base",
      weight: "font-bold",
    },
    2: {
      color: "text-foreground",
      fontSize: "text-sm",
      weight: "font-semibold",
    },
    3: {
      color: "text-foreground/90",
      fontSize: "text-sm",
      weight: "font-medium",
    },
    4: {
      color: "text-foreground/80",
      fontSize: "text-xs",
      weight: "font-medium",
    },
    5: {
      color: "text-foreground/70",
      fontSize: "text-xs",
      weight: "font-normal",
    },
    6: {
      color: "text-foreground/60",
      fontSize: "text-xs",
      weight: "font-normal",
    },
  };
  return styles[level] || styles[6];
};

const getLevelBadgeColor = (level: number) => {
  const colors: Record<number, string> = {
    1: "bg-blue-500",
    2: "bg-green-500",
    3: "bg-yellow-500",
    4: "bg-orange-500",
    5: "bg-red-500",
    6: "bg-purple-500",
  };
  return colors[level] || colors[6];
};

function HeadingRow({ heading }: { heading: HeadingInfo }) {
  const indent = (heading.level - 1) * 16;
  const style = getLevelStyle(heading.level);

  return (
    <div
      className="flex items-start gap-2 py-1.5 px-2 hover:bg-muted/50 rounded-sm transition-colors"
      style={{ paddingLeft: `${indent + 8}px` }}
    >
      <span
        className={`inline-flex items-center justify-center text-[10px] font-bold text-white rounded w-6 h-5 flex-shrink-0 ${getLevelBadgeColor(heading.level)}`}
      >
        H{heading.level}
      </span>
      <span
        className={`${style.color} ${style.fontSize} ${style.weight} break-words flex-1 leading-relaxed`}
      >
        {heading.text}
      </span>
    </div>
  );
}
