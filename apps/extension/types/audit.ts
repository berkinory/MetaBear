import type { AxeResults } from "axe-core";

export interface PerformanceData {
  domContentLoaded: number | null;
  domElements: number;
  fcp: number | null;
  lcp: number | null;
  pageLoad: number | null;
  pageSize: number;
  resourceCount: number;
  ttfb: number | null;
}

export interface AuditResult {
  accessibility: AxeResults | null;
  error?: string;
  performance: PerformanceData;
}

export interface AuditMessage {
  type: "RUN_AUDIT";
}

export interface AuditForTabMessage {
  tabId: number;
  type: "RUN_AUDIT_FOR_TAB";
}

export interface AuditResponse {
  data?: AuditResult;
  error?: string;
  success: boolean;
}

export type Message = AuditForTabMessage | AuditMessage;
