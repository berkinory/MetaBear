import { useEffect, useState } from "react";

import type { AuditResponse, AuditResult } from "@/types/audit";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AuditTab } from "./tabs/AuditTab";
import { HeadingsTab } from "./tabs/HeadingsTab";
import { ImagesTab } from "./tabs/ImagesTab";
import { LinksTab } from "./tabs/LinksTab";
import { MetadataTab } from "./tabs/MetadataTab";
import { SocialTab } from "./tabs/SocialTab";

const isRestrictedUrl = (url: string | undefined): boolean => {
  if (!url) {
    return true;
  }

  const restrictedPatterns = [
    /^chrome:\/\//,
    /^chrome-extension:\/\//,
    /^edge:\/\//,
    /^about:/,
    /^view-source:/,
    /^file:\/\//,
    /^https?:\/\/chrome\.google\.com\/webstore/,
    /^https?:\/\/chromewebstore\.google\.com/,
    /^https?:\/\/microsoftedge\.microsoft\.com\/addons/,
  ];

  return restrictedPatterns.some((pattern) => pattern.test(url));
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRestricted, setIsRestricted] = useState(false);

  const runAudit = async () => {
    setLoading(true);
    setError(null);
    setIsRestricted(false);

    try {
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab?.id) {
        throw new Error("No active tab found");
      }

      if (isRestrictedUrl(tab.url)) {
        setIsRestricted(true);
        setLoading(false);
        return;
      }

      const response: AuditResponse = await browser.runtime.sendMessage({
        tabId: tab.id,
        type: "RUN_AUDIT_FOR_TAB",
      });

      if (!response.success || !response.data) {
        throw new Error(response.error ?? "Unknown error");
      }

      setResult(response.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAudit();
  }, []);

  return (
    <div className="flex flex-col min-w-[320px] min-h-[300px]">
      <header className="flex items-center justify-between p-3 border-b">
        <h1 className="text-lg font-bold">MetaBear</h1>
      </header>

      <Tabs defaultValue="audit" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b">
          <TabsTrigger value="audit">Audit</TabsTrigger>
          <TabsTrigger value="headings">Headings</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
        </TabsList>

        <TabsContent value="audit" className="flex-1 p-4 overflow-auto">
          <AuditTab
            error={error}
            loading={loading}
            result={result}
            isRestricted={isRestricted}
            onRetry={runAudit}
          />
        </TabsContent>

        <TabsContent value="headings" className="flex-1 p-4 overflow-auto">
          <HeadingsTab headings={result?.headings || null} />
        </TabsContent>

        <TabsContent value="images" className="flex-1 p-4 overflow-auto">
          <ImagesTab images={result?.images || null} />
        </TabsContent>

        <TabsContent value="links" className="flex-1 p-4 overflow-auto">
          <LinksTab links={result?.links || null} />
        </TabsContent>

        <TabsContent value="metadata" className="flex-1 p-4 overflow-auto">
          <MetadataTab metadata={result?.metadata || null} />
        </TabsContent>

        <TabsContent value="social" className="flex-1 p-4 overflow-auto">
          <SocialTab metadata={result?.metadata || null} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
