/* oxlint-disable react/no-multi-comp */
import type { MetadataInfo } from "@/types/audit";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SocialTabProps {
  metadata: MetadataInfo | null;
}

export function SocialTab({ metadata }: SocialTabProps) {
  if (!metadata) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">No social metadata available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <OpenGraphCard openGraph={metadata.openGraph} />
      <TwitterCard twitter={metadata.twitter} />
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="space-y-1">
      <div className="text-xs font-semibold text-muted-foreground">{label}</div>
      <div className="text-sm break-all">
        {value ? (
          <span>{value}</span>
        ) : (
          <span className="text-muted-foreground italic">Not set</span>
        )}
      </div>
    </div>
  );
}

function OpenGraphCard({
  openGraph,
}: {
  openGraph: MetadataInfo["openGraph"];
}) {
  const hasAnyOG = Object.values(openGraph).some((v) => v !== null);

  if (!hasAnyOG) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>OpenGraph (Social Media)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground italic">
            No OpenGraph tags found
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>OpenGraph (Social Media)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {openGraph.image && (
          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground">
              Preview Image
            </div>
            <img
              src={openGraph.image}
              alt="OpenGraph preview"
              className="w-full rounded-md border bg-muted"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}
        <MetaRow label="og:title" value={openGraph.title} />
        <MetaRow label="og:description" value={openGraph.description} />
        <MetaRow label="og:image" value={openGraph.image} />
        <MetaRow label="og:url" value={openGraph.url} />
        <MetaRow label="og:type" value={openGraph.type} />
      </CardContent>
    </Card>
  );
}

function TwitterCard({ twitter }: { twitter: MetadataInfo["twitter"] }) {
  const hasAnyTwitter = Object.values(twitter).some((v) => v !== null);

  if (!hasAnyTwitter) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Twitter Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground italic">
            No Twitter Card tags found
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Twitter Card</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {twitter.image && (
          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground">
              Preview Image
            </div>
            <img
              src={twitter.image}
              alt="Twitter card preview"
              className="w-full rounded-md border bg-muted"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}
        <MetaRow label="twitter:card" value={twitter.card} />
        <MetaRow label="twitter:title" value={twitter.title} />
        <MetaRow label="twitter:description" value={twitter.description} />
        <MetaRow label="twitter:image" value={twitter.image} />
      </CardContent>
    </Card>
  );
}
