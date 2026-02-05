/* oxlint-disable react/no-multi-comp */
import {
  DocumentCodeIcon,
  Facebook02Icon,
  GlobalIcon,
  GoogleIcon,
  Image01Icon,
  LicenseNoIcon,
  NewTwitterIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";

import type { MetadataInfo } from "@/types/audit";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface SocialTabProps {
  metadata: MetadataInfo | null;
}

export function SocialTab({ metadata }: SocialTabProps) {
  const isLoading = !metadata;
  const openGraph = metadata?.openGraph ?? {
    title: null,
    description: null,
    image: null,
    url: null,
    type: null,
    locale: null,
    siteName: null,
  };
  const twitter = metadata?.twitter ?? {
    card: null,
    title: null,
    description: null,
    image: null,
  };
  const pageTitle = metadata?.title ?? null;
  const pageDescription = metadata?.description ?? null;
  const pageUrl = metadata?.url ?? null;
  const pageFavicon = metadata?.favicon ?? null;

  return (
    <Tabs defaultValue="tags" className="flex flex-col gap-3">
      <TabsList variant="line" className="w-fit mx-auto justify-center">
        <TabsTrigger
          value="tags"
          className="flex h-8 w-8 flex-none items-center justify-center rounded-md px-0 text-white/60 transition-colors hover:bg-white/10 data-[state=active]:bg-white/20 data-[state=active]:!text-white"
          aria-label="Tags"
          title="Tags"
        >
          <HugeiconsIcon
            icon={DocumentCodeIcon}
            strokeWidth={2}
            className="size-4"
          />
        </TabsTrigger>
        <TabsTrigger
          value="og-image"
          className="flex h-8 w-8 flex-none items-center justify-center rounded-md px-0 text-white/60 transition-colors hover:bg-white/10 data-[state=active]:bg-white/20 data-[state=active]:!text-white"
          aria-label="Open Graph Image"
          title="Open Graph Image"
        >
          <HugeiconsIcon
            icon={Image01Icon}
            strokeWidth={2}
            className="size-4"
          />
        </TabsTrigger>
        <TabsTrigger
          value="twitter-image"
          className="flex h-8 w-8 flex-none items-center justify-center rounded-md px-0 text-white/60 transition-colors hover:bg-white/10 data-[state=active]:bg-white/20 data-[state=active]:!text-white"
          aria-label="Twitter Image"
          title="Twitter Image"
        >
          <HugeiconsIcon
            icon={NewTwitterIcon}
            strokeWidth={2}
            className="size-4"
          />
        </TabsTrigger>
        <TabsTrigger
          value="google"
          className="flex h-8 w-8 flex-none items-center justify-center rounded-md px-0 text-white/60 transition-colors hover:bg-white/10 data-[state=active]:bg-white/20 data-[state=active]:!text-white"
          aria-label="Google"
          title="Google"
        >
          <HugeiconsIcon icon={GoogleIcon} strokeWidth={2} className="size-4" />
        </TabsTrigger>
        <TabsTrigger
          value="facebook"
          className="flex h-8 w-8 flex-none items-center justify-center rounded-md px-0 text-white/60 transition-colors hover:bg-white/10 data-[state=active]:bg-white/20 data-[state=active]:!text-white"
          aria-label="Facebook"
          title="Facebook"
        >
          <HugeiconsIcon
            icon={Facebook02Icon}
            strokeWidth={2}
            className="size-4"
          />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tags" className="min-h-[160px]">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <OpenGraphCard openGraph={openGraph} loading={isLoading} />
          <TwitterCard twitter={twitter} loading={isLoading} />
        </motion.div>
      </TabsContent>
      <TabsContent value="og-image" className="min-h-[160px]">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <OpenGraphPreviewCard
            loading={isLoading}
            imageUrl={openGraph.image}
            title={openGraph.title}
          />
        </motion.div>
      </TabsContent>
      <TabsContent value="twitter-image" className="min-h-[160px]">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <TwitterPreviewCard
            loading={isLoading}
            imageUrl={twitter.image}
            title={twitter.title}
            fallbackImageUrl={openGraph.image}
            fallbackTitle={openGraph.title}
          />
        </motion.div>
      </TabsContent>
      <TabsContent value="google" className="min-h-[160px]">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <GooglePreviewCard
            loading={isLoading}
            title={pageTitle ?? openGraph.title}
            description={pageDescription ?? openGraph.description}
            url={pageUrl ?? openGraph.url}
            favicon={pageFavicon}
            siteName={openGraph.siteName}
          />
        </motion.div>
      </TabsContent>
      <TabsContent value="facebook" className="min-h-[160px]">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <FacebookPreviewCard
            loading={isLoading}
            title={openGraph.title}
            description={openGraph.description}
            imageUrl={openGraph.image}
            url={pageUrl ?? openGraph.url}
            siteName={openGraph.siteName}
          />
        </motion.div>
      </TabsContent>
    </Tabs>
  );
}

function MetaRow({
  label,
  value,
  multiline = false,
  rows = 2,
}: {
  label: string;
  value: string | null;
  multiline?: boolean;
  rows?: number;
}) {
  const content = value ?? "";

  return (
    <div className="space-y-1">
      <div className="text-xs font-semibold text-muted-foreground">{label}</div>
      {multiline ? (
        <Textarea
          value={content}
          readOnly
          rows={rows}
          className="resize-none text-sm text-foreground"
        />
      ) : (
        <Input value={content} readOnly className="text-sm text-foreground" />
      )}
    </div>
  );
}

function OpenGraphCard({
  openGraph,
  loading,
}: {
  openGraph: MetadataInfo["openGraph"];
  loading: boolean;
}) {
  const hasAnyOG = Object.values(openGraph).some((v) => v !== null);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">Open Graph</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-8 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-8 w-full rounded-lg" />
          <Skeleton className="h-8 w-full rounded-lg" />
          <Skeleton className="h-8 w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (!hasAnyOG) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">Open Graph</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
            <HugeiconsIcon
              icon={LicenseNoIcon}
              strokeWidth={2}
              className="size-6"
            />
            <span className="text-sm">No Open Graph tags found</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-muted-foreground">Open Graph</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <MetaRow label="og:title" value={openGraph.title} />
        <MetaRow
          label="og:description"
          value={openGraph.description}
          multiline
          rows={3}
        />
        <MetaRow label="og:url" value={openGraph.url} />
        <MetaRow label="og:type" value={openGraph.type} />
        <MetaRow label="og:locale" value={openGraph.locale} />
      </CardContent>
    </Card>
  );
}

function TwitterCard({
  twitter,
  loading,
}: {
  twitter: MetadataInfo["twitter"];
  loading: boolean;
}) {
  const hasAnyTwitter = Object.values(twitter).some((v) => v !== null);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">Twitter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-8 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-8 w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (!hasAnyTwitter) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">Twitter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
            <HugeiconsIcon
              icon={LicenseNoIcon}
              strokeWidth={2}
              className="size-6"
            />
            <span className="text-sm">No Twitter tags found</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-muted-foreground">Twitter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <MetaRow label="twitter:title" value={twitter.title} />
        <MetaRow
          label="twitter:description"
          value={twitter.description}
          multiline
          rows={3}
        />
        <MetaRow label="twitter:card" value={twitter.card} />
      </CardContent>
    </Card>
  );
}

function OpenGraphPreviewCard({
  loading,
  imageUrl,
  title,
}: {
  loading: boolean;
  imageUrl: string | null;
  title: string | null;
}) {
  if (loading) {
    return <Skeleton className="h-48 w-full rounded-2xl" />;
  }

  if (!imageUrl) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
        <HugeiconsIcon
          icon={LicenseNoIcon}
          strokeWidth={2}
          className="size-6"
        />
        <span className="text-sm">No Open Graph image found</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-base font-medium text-muted-foreground">
        Open Graph
      </div>
      <a
        href={imageUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block overflow-hidden rounded-2xl border border-white/10 bg-[#0f1114]"
      >
        <img
          src={imageUrl}
          alt={title ?? "Open Graph image"}
          className="h-48 w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      </a>
    </div>
  );
}

function TwitterPreviewCard({
  loading,
  imageUrl,
  title,
  fallbackImageUrl,
  fallbackTitle,
}: {
  loading: boolean;
  imageUrl: string | null;
  title: string | null;
  fallbackImageUrl: string | null;
  fallbackTitle: string | null;
}) {
  if (loading) {
    return <Skeleton className="h-48 w-full rounded-2xl" />;
  }

  const resolvedImageUrl = imageUrl ?? fallbackImageUrl;
  const resolvedTitle = title ?? fallbackTitle;

  if (!resolvedImageUrl) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
        <HugeiconsIcon
          icon={LicenseNoIcon}
          strokeWidth={2}
          className="size-6"
        />
        <span className="text-sm">No Twitter image found</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-base font-medium text-muted-foreground">
        Twitter (X)
      </div>
      <a
        href={resolvedImageUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block overflow-hidden rounded-2xl border border-white/10 bg-[#0f1114]"
      >
        <img
          src={resolvedImageUrl}
          alt={title ?? "Twitter image"}
          className="h-48 w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
        {resolvedTitle ? (
          <div className="absolute inset-x-2 bottom-1.5">
            <span className="inline-block max-w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-sm bg-black/75 px-1.5 py-0.5 text-[10.5px] font-normal text-white">
              {resolvedTitle}
            </span>
          </div>
        ) : null}
      </a>
    </div>
  );
}

function FacebookPreviewCard({
  loading,
  title,
  description,
  imageUrl,
  url,
  siteName,
}: {
  loading: boolean;
  title: string | null;
  description: string | null;
  imageUrl: string | null;
  url: string | null;
  siteName: string | null;
}) {
  if (loading) {
    return <Skeleton className="h-64 w-full rounded-2xl" />;
  }

  const host = getHost(url ?? "");
  const displaySite = siteName || host || "Website";

  return (
    <div className="space-y-2">
      <div className="text-base font-medium text-muted-foreground">
        Facebook
      </div>
      <div className="rounded-2xl border border-white/10 bg-[#282828] text-white shadow-sm overflow-hidden">
        <div className="bg-[#242424] px-4 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#3a4a5e] text-white/90">
              B
            </div>
            <div className="flex flex-col">
              <span className="text-md font-medium text-white">Berkinory</span>
              <div className="flex items-center gap-1 text-xs font-medium text-white/60">
                <span>{formatFacebookDate(new Date())}</span>
                <span>·</span>
                <HugeiconsIcon
                  icon={GlobalIcon}
                  strokeWidth={1.5}
                  className="size-3 text-white/60"
                />
              </div>
            </div>
          </div>
          <div className="mt-3 text-sm text-white/90">Hey, Check this out!</div>
        </div>
        {imageUrl ? (
          <div className="bg-[#242424]">
            <img
              src={imageUrl}
              alt={title ?? "Facebook preview"}
              className="h-56 w-full object-contain"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          </div>
        ) : null}
        <div className="bg-[#242424] px-4 pt-2.5 pb-3">
          <div className="text-[11px] tracking-wide text-white/65">
            {displaySite}
          </div>
          <div className="mt-0.5 text-sm font-semibold text-white/90 line-clamp-2">
            {title || "Untitled"}
          </div>
          <div className="mt-0.5 text-xs text-white/65 line-clamp-2">
            {description || "No description available."}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatFacebookDate(date: Date): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day} ${month} at ${hours}:${minutes}`;
}

function GooglePreviewCard({
  loading,
  title,
  description,
  url,
  favicon,
  siteName,
}: {
  loading: boolean;
  title: string | null;
  description: string | null;
  url: string | null;
  favicon: string | null;
  siteName: string | null;
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-40 rounded-lg" />
        <Skeleton className="h-7 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    );
  }

  const titleText = title ?? "";
  const descriptionText = description ?? "";
  const urlText = url ?? "";
  const displayUrl = formatSerpUrl(urlText);

  if (!titleText && !descriptionText && !urlText) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
        <HugeiconsIcon
          icon={LicenseNoIcon}
          strokeWidth={2}
          className="size-6"
        />
        <span className="text-sm">No preview data</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="text-base font-medium text-muted-foreground">
          Desktop
        </div>
        <Card className="border border-white/10 bg-[#242424] rounded-2xl">
          <CardContent className="px-2.5 py-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full shrink-0">
                  {favicon ? (
                    <img
                      src={favicon}
                      alt=""
                      className="h-6 w-6 rounded-full object-cover ring-1 ring-white/20"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-xs text-white/70">G</span>
                  )}
                </span>
                <div className="flex flex-col justify-center leading-tight">
                  <span className="text-[12px] text-white/90">
                    {siteName || getHost(urlText) || "Website"}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-white/50">
                      {displayUrl || urlText || ""}
                    </span>
                    <span className="flex flex-col items-center gap-0.5 text-white/40">
                      <span className="h-0.5 w-0.5 rounded-full bg-current" />
                      <span className="h-0.5 w-0.5 rounded-full bg-current" />
                      <span className="h-0.5 w-0.5 rounded-full bg-current" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2 text-[15px] leading-snug text-[#8ab4f8] line-clamp-1">
              {titleText || "Untitled"}
            </div>
            <div className="mt-1 text-[11px] leading-relaxed text-white/70 line-clamp-2">
              {descriptionText || "No description available."}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-2">
        <div className="text-base font-medium text-muted-foreground">
          Mobile
        </div>
        <Card className="border border-white/10 bg-[#242424] rounded-2xl">
          <CardContent className="px-2.5 py-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full shrink-0">
                  {favicon ? (
                    <img
                      src={favicon}
                      alt=""
                      className="h-6 w-6 rounded-full object-cover ring-1 ring-white/20"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-xs text-white/70">G</span>
                  )}
                </span>
                <div className="flex flex-col justify-center leading-tight">
                  <span className="text-[12px] text-white/90">
                    {siteName || getHost(urlText) || "Website"}
                  </span>
                  <span className="text-[9px] text-white/50">
                    {displayUrl || urlText || ""}
                  </span>
                </div>
              </div>
              <span className="self-center flex flex-col items-center gap-0.5 text-white/40">
                <span className="h-0.5 w-0.5 rounded-full bg-current" />
                <span className="h-0.5 w-0.5 rounded-full bg-current" />
                <span className="h-0.5 w-0.5 rounded-full bg-current" />
              </span>
            </div>
            <div className="mt-2 text-[15px] leading-snug text-[#8ab4f8] line-clamp-2">
              {titleText || "Untitled"}
            </div>
            <div className="mt-1 text-[11px] leading-relaxed text-white/70 line-clamp-3">
              {descriptionText || "No description available."}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function formatUrl(url: string): string {
  const cleaned = url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/+$/, "");
  if (!cleaned) {
    return "";
  }
  if (cleaned.length <= 45) {
    return cleaned;
  }
  return `${cleaned.slice(0, 45)}...`;
}

function getHost(url: string): string {
  if (!url) {
    return "";
  }
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function formatSerpUrl(url: string): string {
  if (!url) {
    return "";
  }

  try {
    const parsed = new URL(url);
    const host = parsed.origin.replace(/^https?:\/\/(www\.)?/, (match) =>
      match.replace("www.", "")
    );
    const path = parsed.pathname.replace(/\/+$/, "");
    if (!path || path === "/") {
      return host;
    }
    const segments = path.split("/").filter(Boolean);
    if (segments.length === 0) {
      return host;
    }
    const trail = segments.join(" > ");
    return `${host} > ${trail}`;
  } catch {
    return formatUrl(url);
  }
}
