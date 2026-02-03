/* oxlint-disable react/no-multi-comp */
import type { LinkInfo } from "@/types/audit";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LinksTabProps {
  links: LinkInfo[] | null;
}

export function LinksTab({ links }: LinksTabProps) {
  if (!links || links.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">No links found on this page</p>
      </div>
    );
  }

  const internalLinks = links.filter((link) => !link.isExternal);
  const externalLinks = links.filter((link) => link.isExternal);
  const emptyTextLinks = links.filter(
    (link) => !link.text || link.text.trim() === ""
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Links Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total Links:</span>
            <Badge variant="secondary">{links.length}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Internal Links:</span>
            <Badge variant="secondary">{internalLinks.length}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">External Links:</span>
            <Badge variant="secondary">{externalLinks.length}</Badge>
          </div>
          {emptyTextLinks.length > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-destructive">
                Empty Text:
              </span>
              <Badge variant="destructive">{emptyTextLinks.length}</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {internalLinks.length > 0 && (
        <LinkListCard title="Internal Links" links={internalLinks} />
      )}

      {externalLinks.length > 0 && (
        <LinkListCard title="External Links" links={externalLinks} />
      )}

      {emptyTextLinks.length > 0 && (
        <LinkListCard
          title="Links with Empty Text"
          links={emptyTextLinks}
          isError
        />
      )}
    </div>
  );
}

interface LinkListCardProps {
  title: string;
  links: LinkInfo[];
  isError?: boolean;
}

function LinkListCard({ title, links, isError = false }: LinkListCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={isError ? "text-destructive" : ""}>
          {title} ({links.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {links.map((link, index) => (
            <div
              key={`${link.href}-${index}`}
              className="p-3 rounded-md bg-muted/50 space-y-2 break-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  {link.text ? (
                    <p className="text-sm font-medium">{link.text}</p>
                  ) : (
                    <p className="text-sm font-medium text-muted-foreground italic">
                      (no text)
                    </p>
                  )}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {link.isExternal && (
                    <Badge variant="outline" className="text-xs">
                      External
                    </Badge>
                  )}
                  {link.hasNofollow && (
                    <Badge variant="secondary" className="text-xs">
                      nofollow
                    </Badge>
                  )}
                </div>
              </div>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:underline block truncate"
              >
                {link.href}
              </a>
              {link.title && (
                <p className="text-xs text-muted-foreground">
                  Title: {link.title}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
