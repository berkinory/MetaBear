import { Alert01Icon, LicenseNoIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

/* oxlint-disable react/no-multi-comp */
import type { LinkInfo } from "@/types/audit";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LinksTabProps {
  links: LinkInfo[] | null;
  baseUrl: string | null;
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}...`;
}

export function LinksTab({ links, baseUrl }: LinksTabProps) {
  const isLoading = links === null;
  const internalLinks = links?.filter((link) => !link.isExternal) ?? [];
  const externalLinks = links?.filter((link) => link.isExternal) ?? [];
  const emptyTextLinks =
    links?.filter((link) => !link.text || link.text.trim() === "") ?? [];
  const sortedLinks = links
    ? [...links].toSorted((a, b) => Number(b.isExternal) - Number(a.isExternal))
    : null;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-muted-foreground">Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
              <span>Total</span>
              <span className="text-muted-foreground/70">—</span>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
              <span>Internal</span>
              <span className="text-muted-foreground/70">—</span>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
              <span>External</span>
              <span className="text-muted-foreground/70">—</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-muted-foreground">All Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
              <HugeiconsIcon
                icon={LicenseNoIcon}
                strokeWidth={2}
                className="size-6"
              />
              <span className="text-sm">No audit data yet.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  let listContent = (
    <Card>
      <CardContent>
        <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
          <HugeiconsIcon
            icon={LicenseNoIcon}
            strokeWidth={2}
            className="size-6"
          />
          <span className="text-sm">No links found</span>
        </div>
      </CardContent>
    </Card>
  );

  if (links && links.length > 0) {
    listContent = (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-muted-foreground">All Links</CardTitle>
          <div className="flex gap-2">
            <Badge variant="secondary" className="font-mono">
              {links.length}
            </Badge>
            {emptyTextLinks.length > 0 && (
              <Badge
                variant="outline"
                className="border-orange-400/40 text-orange-200 bg-orange-400/10"
              >
                <span className="font-mono">{emptyTextLinks.length}</span>
                <span className="font-sans ml-1">missing text</span>
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sortedLinks?.map((link, index) => (
              <LinkRow
                key={`${link.href}-${index}`}
                link={link}
                baseUrl={baseUrl}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
            <span>Total</span>
            <span className="text-foreground font-mono">
              {links?.length ?? 0}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
            <span>Internal</span>
            <span className="text-foreground font-mono">
              {internalLinks.length}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
            <span>External</span>
            <span className="text-foreground font-mono">
              {externalLinks.length}
            </span>
          </div>
        </CardContent>
      </Card>

      {listContent}
    </div>
  );
}

function LinkRow({
  link,
  baseUrl,
}: {
  link: LinkInfo;
  baseUrl: string | null;
}) {
  const hasMissingText = !link.text || link.text.trim() === "";
  const displayText = link.text ? truncateText(link.text, 35) : "Missing text";
  const displayTitle = link.title ? truncateText(link.title, 35) : null;
  const displayHref = truncateText(link.href, 40);
  const isJavascriptLink = /^javascript:/i.test(link.href.trim());
  const resolvedHref = (() => {
    if (isJavascriptLink) {
      return "#";
    }
    if (link.isExternal) {
      return link.href;
    }
    if (!baseUrl) {
      return link.href;
    }
    try {
      return new URL(link.href, baseUrl).toString();
    } catch {
      return link.href;
    }
  })();

  return (
    <a
      href={resolvedHref}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => {
        if (isJavascriptLink) {
          event.preventDefault();
          event.stopPropagation();
        }
      }}
      className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-white/5 transition-colors select-none cursor-pointer min-w-0 w-full"
    >
      <div className="min-w-0 w-0 flex-1 overflow-hidden">
        <div className="flex items-center gap-2 min-w-0 overflow-hidden">
          {link.isExternal ? (
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 h-4 font-sans shrink-0 bg-blue-500/10 text-blue-300 border-blue-500/30"
            >
              EXT
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 h-4 font-sans shrink-0 bg-green-500/10 text-green-300 border-green-500/30"
            >
              INT
            </Badge>
          )}
          <span
            className={`text-sm font-sans truncate ${
              hasMissingText ? "text-orange-200" : "text-foreground/90"
            }`}
            title={link.text || "Missing text"}
          >
            {displayText}
          </span>
          {hasMissingText && (
            <HugeiconsIcon
              icon={Alert01Icon}
              strokeWidth={2}
              className="size-3.5 text-orange-200 shrink-0"
            />
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5 min-w-0 w-full overflow-hidden">
          <span
            className="block text-[10px] text-muted-foreground truncate font-mono min-w-0 w-full"
            title={link.href}
          >
            {displayHref}
          </span>
          {link.hasNofollow && (
            <Badge
              variant="secondary"
              className="text-[10px] px-1.5 py-0 h-4 font-sans shrink-0"
            >
              nofollow
            </Badge>
          )}
          {isJavascriptLink && (
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 h-4 font-sans shrink-0 border-orange-400/40 text-orange-200 bg-orange-400/10"
            >
              javascript
            </Badge>
          )}
        </div>
        {displayTitle && (
          <div className="text-[10px] text-muted-foreground/70 truncate mt-0.5">
            {displayTitle}
          </div>
        )}
      </div>
    </a>
  );
}
