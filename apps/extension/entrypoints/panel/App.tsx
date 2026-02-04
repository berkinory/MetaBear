import {
  Audit02Icon,
  Cancel01Icon,
  Image02Icon,
  Link04Icon,
  Share01Icon,
  Tag02Icon,
  TextFontIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import type { AuditResponse, AuditResult } from "@/types/audit";

import { ScrollArea } from "@/components/ui/scroll-area";
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

const handleClose = () => {
  if (typeof window !== "undefined") {
    window.parent?.postMessage({ type: "CLOSE_PANEL" }, "*");
  }
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRestricted, setIsRestricted] = useState(false);
  const didRunRef = useRef(false);

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
    if (didRunRef.current) {
      return;
    }

    didRunRef.current = true;
    runAudit();
  }, []);

  return (
    <div
      className="font-sans flex h-full w-full flex-col overflow-hidden rounded-3xl pb-1 shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_4px_24px_rgba(0,0,0,0.4)]"
      style={{ backgroundColor: "rgba(48, 48, 48, 1)" }}
    >
      <header className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <img src="/icon/128.png" alt="MetaBear" className="h-7 w-7" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">MetaBear</span>
            <span className="text-[11px] text-muted-foreground">
              metabear.dev
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/10 text-muted-foreground transition hover:bg-white/20 hover:text-foreground"
          aria-label="Close panel"
          title="Close"
        >
          <HugeiconsIcon
            icon={Cancel01Icon}
            strokeWidth={2}
            className="size-3.5"
          />
        </button>
      </header>
      <Tabs defaultValue="audit" className="min-h-0 flex-1 flex flex-col gap-0">
        <TabsList
          variant="line"
          className="grid h-auto w-full grid-cols-3 gap-1 bg-transparent p-2"
        >
          <TabsTrigger
            value="audit"
            className="flex h-8 items-center justify-center gap-1.5 rounded-md px-2 text-xs text-white/60 transition-colors hover:bg-white/10 data-[state=active]:bg-white/20 data-[state=active]:!text-white"
          >
            <HugeiconsIcon
              icon={Audit02Icon}
              strokeWidth={2}
              className="size-3.5"
            />
            <span>Audit</span>
          </TabsTrigger>
          <TabsTrigger
            value="metadata"
            className="flex h-8 items-center justify-center gap-1.5 rounded-md px-2 text-xs text-white/60 transition-colors hover:bg-white/10 data-[state=active]:bg-white/20 data-[state=active]:!text-white"
          >
            <HugeiconsIcon
              icon={Tag02Icon}
              strokeWidth={2}
              className="size-3.5"
            />
            <span>Meta</span>
          </TabsTrigger>
          <TabsTrigger
            value="headings"
            className="flex h-8 items-center justify-center gap-1.5 rounded-md px-2 text-xs text-white/60 transition-colors hover:bg-white/10 data-[state=active]:bg-white/20 data-[state=active]:!text-white"
          >
            <HugeiconsIcon
              icon={TextFontIcon}
              strokeWidth={2}
              className="size-3.5"
            />
            <span>Headings</span>
          </TabsTrigger>
          <TabsTrigger
            value="images"
            className="flex h-8 items-center justify-center gap-1.5 rounded-md px-2 text-xs text-white/60 transition-colors hover:bg-white/10 data-[state=active]:bg-white/20 data-[state=active]:!text-white"
          >
            <HugeiconsIcon
              icon={Image02Icon}
              strokeWidth={2}
              className="size-3.5"
            />
            <span>Images</span>
          </TabsTrigger>
          <TabsTrigger
            value="links"
            className="flex h-8 items-center justify-center gap-1.5 rounded-md px-2 text-xs text-white/60 transition-colors hover:bg-white/10 data-[state=active]:bg-white/20 data-[state=active]:!text-white"
          >
            <HugeiconsIcon
              icon={Link04Icon}
              strokeWidth={2}
              className="size-3.5"
            />
            <span>Links</span>
          </TabsTrigger>
          <TabsTrigger
            value="social"
            className="flex h-8 items-center justify-center gap-1.5 rounded-md px-2 text-xs text-white/60 transition-colors hover:bg-white/10 data-[state=active]:bg-white/20 data-[state=active]:!text-white"
          >
            <HugeiconsIcon
              icon={Share01Icon}
              strokeWidth={2}
              className="size-3.5"
            />
            <span>Social</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="audit" className="flex-1 pt-1">
          <ScrollArea className="h-full">
            <motion.div
              className="p-4"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <AuditTab
                error={error}
                loading={loading}
                result={result}
                isRestricted={isRestricted}
                onRetry={runAudit}
              />
            </motion.div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="metadata" className="flex-1 pt-1">
          <ScrollArea className="h-full">
            <motion.div
              className="p-4"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <MetadataTab
                metadata={result?.metadata || null}
                linkCount={result?.links.length ?? 0}
                imageCount={result?.images.length ?? 0}
              />
            </motion.div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="headings" className="flex-1 pt-1">
          <ScrollArea className="h-full">
            <motion.div
              className="p-4"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <HeadingsTab headings={result?.headings || null} />
            </motion.div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="images" className="flex-1 pt-1">
          <ScrollArea className="h-full">
            <motion.div
              className="p-4"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <ImagesTab images={result?.images || null} />
            </motion.div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="links" className="flex-1 pt-1">
          <ScrollArea className="h-full">
            <motion.div
              className="p-4"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <LinksTab links={result?.links || null} />
            </motion.div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="social" className="flex-1 pt-1">
          <ScrollArea className="h-full">
            <motion.div
              className="p-4"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <SocialTab metadata={result?.metadata || null} />
            </motion.div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
