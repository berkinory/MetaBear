import axe from "axe-core";
import { onFCP, onLCP, onTTFB } from "web-vitals";

import type { AuditMessage, AuditResult, PerformanceData } from "@/types/audit";

export default defineContentScript({
  main() {
    const perf: PerformanceData = {
      domContentLoaded: null,
      domElements: 0,
      fcp: null,
      lcp: null,
      pageLoad: null,
      pageSize: 0,
      resourceCount: 0,
      ttfb: null,
    };

    onTTFB((metric) => (perf.ttfb = metric.value));
    onFCP((metric) => (perf.fcp = metric.value));
    onLCP((metric) => (perf.lcp = metric.value), { reportAllChanges: true });

    browser.runtime.onMessage.addListener(
      (message: AuditMessage, _sender, sendResponse) => {
        if (message.type === "RUN_AUDIT") {
          (async () => {
            try {
              const result = await runAudit(perf);
              sendResponse(result);
            } catch (error) {
              const errorMessage =
                error instanceof Error ? error.message : "Unknown error";
              sendResponse({
                accessibility: null,
                error: errorMessage,
                performance: perf,
              });
            }
          })();
          return true;
        }
      }
    );
  },
  matches: ["http://*/*", "https://*/*"],
});

async function runAudit(perf: PerformanceData): Promise<AuditResult> {
  const navTiming = performance.getEntriesByType(
    "navigation"
  )[0] as PerformanceNavigationTiming;

  if (navTiming) {
    perf.domContentLoaded = Math.round(
      navTiming.domContentLoadedEventEnd - navTiming.startTime
    );
    perf.pageLoad = Math.round(navTiming.loadEventEnd - navTiming.startTime);
  }

  const resources = performance.getEntriesByType(
    "resource"
  ) as PerformanceResourceTiming[];
  perf.resourceCount = resources.length;
  perf.pageSize = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
  perf.domElements = document.getElementsByTagName("*").length;

  const accessibility = await axe.run(document);

  return { accessibility, performance: perf };
}
