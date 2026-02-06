import type {
  AuditForTabMessage,
  AuditResponse,
  AuditResult,
} from "@/types/audit";

const RESTRICTED_URL_PATTERNS = [
  /^chrome:\/\//,
  /^chrome-extension:\/\//,
  /^edge:\/\//,
  /^about:/,
  /^view-source:/,
  /^file:\/\//,
  /^https?:\/\/chrome\.google\.com\/webstore/,
  /^https?:\/\/chromewebstore\.google\.com/,
  /^https?:\/\/microsoftedge\.microsoft\.com\/addons/,
] as const;

interface AuditCacheEntry {
  url: string | null;
  result: AuditResult;
}

const auditCache = new Map<number, AuditCacheEntry>();

export default defineBackground(() => {
  browser.action.onClicked.addListener(async (tab) => {
    if (!tab.id) {
      return;
    }

    if (isRestrictedUrl(tab.url)) {
      return;
    }

    try {
      await browser.tabs.sendMessage(tab.id, { type: "TOGGLE_PANEL" });
      return;
    } catch {
      // No content script yet
    }

    try {
      await browser.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content-scripts/content.js"],
      });
      await browser.tabs.sendMessage(tab.id, { type: "TOGGLE_PANEL" });
    } catch {
      // Ignore injection failures on restricted pages.
    }
  });

  browser.runtime.onMessage.addListener(
    (message: AuditForTabMessage, _sender, sendResponse) => {
      if (message.type === "RUN_AUDIT_FOR_TAB") {
        (async () => {
          try {
            const result = await runAuditForTab(message.tabId);
            sendResponse({ data: result, success: true } as AuditResponse);
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Unknown error";
            sendResponse({
              error: errorMessage,
              success: false,
            } as AuditResponse);
          }
        })();
        return true;
      }
    }
  );

  browser.tabs.onRemoved.addListener((tabId) => {
    auditCache.delete(tabId);
  });

  browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === "loading") {
      auditCache.delete(tabId);
    }
    if (changeInfo.url) {
      auditCache.delete(tabId);
    }
  });

  browser.webNavigation.onCommitted.addListener((details) => {
    if (details.frameId === 0) {
      auditCache.delete(details.tabId);
    }
  });

  browser.webNavigation.onHistoryStateUpdated.addListener((details) => {
    if (details.frameId === 0) {
      auditCache.delete(details.tabId);
    }
  });
});

const isRestrictedUrl = (url: string | undefined): boolean => {
  if (!url) {
    return true;
  }

  return RESTRICTED_URL_PATTERNS.some((pattern) => pattern.test(url));
};

async function runAuditForTab(tabId: number): Promise<AuditResult> {
  const tab = await browser.tabs.get(tabId);
  const currentUrl = tab.url ?? null;

  if (isRestrictedUrl(currentUrl ?? undefined)) {
    throw new Error("Restricted URL");
  }

  const cached = auditCache.get(tabId);
  if (cached && cached.url === currentUrl) {
    return cached.result;
  }

  const result = await browser.tabs.sendMessage(tabId, { type: "RUN_AUDIT" });
  auditCache.set(tabId, { url: currentUrl, result });
  return result;
}
