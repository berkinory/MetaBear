/* oxlint-disable react/no-multi-comp */
import type { AxeResults } from "axe-core";

import type { AuditResult } from "@/types/audit";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

interface AuditTabProps {
  error: string | null;
  loading: boolean;
  result: AuditResult | null;
  isRestricted: boolean;
  onRetry: () => void;
}

const formatMs = (v: number | null) =>
  v !== null ? `${Math.round(v)}ms` : "-";

const getImpactVariant = (impact: string) => {
  const variants: Record<string, "destructive" | "default" | "secondary"> = {
    critical: "destructive",
    serious: "destructive",
    moderate: "secondary",
    minor: "secondary",
  };
  return variants[impact] ?? "default";
};

export function AuditTab({
  error,
  loading,
  result,
  isRestricted,
  onRetry,
}: AuditTabProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-4">
        <Spinner className="size-8" />
        <p className="text-muted-foreground">Analyzing...</p>
      </div>
    );
  }

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

  if (!result) {
    return null;
  }

  return (
    <div className="space-y-4">
      <PerformanceCard
        fcp={result.performance.fcp}
        lcp={result.performance.lcp}
        ttfb={result.performance.ttfb}
      />
      {result.accessibility && (
        <AccessibilityCard data={result.accessibility} />
      )}
    </div>
  );
}

function PerformanceCard({
  fcp,
  lcp,
  ttfb,
}: {
  fcp: number | null;
  lcp: number | null;
  ttfb: number | null;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">TTFB</span>
          <span className="font-mono">{formatMs(ttfb)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">FCP</span>
          <span className="font-mono">{formatMs(fcp)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">LCP</span>
          <span className="font-mono">{formatMs(lcp)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function AccessibilityCard({ data }: { data: AxeResults }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Accessibility</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2 text-sm text-center">
          <Card className="border-destructive/50 bg-destructive/10">
            <CardContent className="pt-4">
              <div className="text-lg font-bold text-destructive">
                {data.violations.length}
              </div>
              <div className="text-xs text-muted-foreground">Violations</div>
            </CardContent>
          </Card>
          <Card className="border-green-500/50 bg-green-500/10">
            <CardContent className="pt-4">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {data.passes.length}
              </div>
              <div className="text-xs text-muted-foreground">Passes</div>
            </CardContent>
          </Card>
          <Card className="border-yellow-500/50 bg-yellow-500/10">
            <CardContent className="pt-4">
              <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                {data.incomplete.length}
              </div>
              <div className="text-xs text-muted-foreground">Incomplete</div>
            </CardContent>
          </Card>
        </div>

        {data.violations.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground">
              Top Issues:
            </h3>
            {data.violations.slice(0, 3).map((v) => (
              <Card key={v.id} className="bg-muted">
                <CardContent className="pt-4">
                  <div className="text-xs flex items-start gap-2">
                    <Badge variant={getImpactVariant(v.impact ?? "minor")}>
                      {v.impact}
                    </Badge>
                    <span className="flex-1">{v.description}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
