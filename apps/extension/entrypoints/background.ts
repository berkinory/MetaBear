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
});

const isRestrictedUrl = (url: string | undefined): boolean => {
  if (!url) {
    return true;
  }

  return RESTRICTED_URL_PATTERNS.some((pattern) => pattern.test(url));
};

async function runAuditForTab(tabId: number): Promise<AuditResult> {
  return browser.tabs.sendMessage(tabId, { type: "RUN_AUDIT" });
}
