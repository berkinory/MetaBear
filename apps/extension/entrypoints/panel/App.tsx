import {
  Analytics01Icon,
  HeadingIcon,
  Image01Icon,
  InformationCircleIcon,
  Link01Icon,
  Share08Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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
    <div className="flex h-full w-full flex-col rounded-2xl border border-border bg-card shadow-[0_18px_45px_rgba(0,0,0,0.18)]">
      <Tabs defaultValue="audit" className="flex-1 flex flex-col gap-0">
        <TabsList
          variant="line"
          className="w-full justify-between rounded-t-2xl border-b border-border bg-card/95 px-2 py-1"
        >
          <TabsTrigger
            value="audit"
            aria-label="Audit"
            title="Audit"
            className="h-9 w-9 p-0"
          >
            <HugeiconsIcon
              icon={Analytics01Icon}
              strokeWidth={2}
              className="size-4"
            />
            <span className="sr-only">Audit</span>
          </TabsTrigger>
          <TabsTrigger
            value="headings"
            aria-label="Headings"
            title="Headings"
            className="h-9 w-9 p-0"
          >
            <HugeiconsIcon
              icon={HeadingIcon}
              strokeWidth={2}
              className="size-4"
            />
            <span className="sr-only">Headings</span>
          </TabsTrigger>
          <TabsTrigger
            value="images"
            aria-label="Images"
            title="Images"
            className="h-9 w-9 p-0"
          >
            <HugeiconsIcon
              icon={Image01Icon}
              strokeWidth={2}
              className="size-4"
            />
            <span className="sr-only">Images</span>
          </TabsTrigger>
          <TabsTrigger
            value="links"
            aria-label="Links"
            title="Links"
            className="h-9 w-9 p-0"
          >
            <HugeiconsIcon
              icon={Link01Icon}
              strokeWidth={2}
              className="size-4"
            />
            <span className="sr-only">Links</span>
          </TabsTrigger>
          <TabsTrigger
            value="metadata"
            aria-label="Metadata"
            title="Metadata"
            className="h-9 w-9 p-0"
          >
            <HugeiconsIcon
              icon={InformationCircleIcon}
              strokeWidth={2}
              className="size-4"
            />
            <span className="sr-only">Metadata</span>
          </TabsTrigger>
          <TabsTrigger
            value="social"
            aria-label="Social"
            title="Social"
            className="h-9 w-9 p-0"
          >
            <HugeiconsIcon
              icon={Share08Icon}
              strokeWidth={2}
              className="size-4"
            />
            <span className="sr-only">Social</span>
          </TabsTrigger>
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
