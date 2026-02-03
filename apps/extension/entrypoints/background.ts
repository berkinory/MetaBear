import type {
  AuditForTabMessage,
  AuditResponse,
  AuditResult,
} from "@/types/audit";

export default defineBackground(() => {
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

async function runAuditForTab(tabId: number): Promise<AuditResult> {
  return browser.tabs.sendMessage(tabId, { type: "RUN_AUDIT" });
}
