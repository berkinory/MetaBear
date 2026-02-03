/* oxlint-disable react/no-multi-comp */
import type { MetadataInfo } from "@/types/audit";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetadataTabProps {
  metadata: MetadataInfo | null;
}

export function MetadataTab({ metadata }: MetadataTabProps) {
  if (!metadata) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">No metadata available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <BasicMetaCard metadata={metadata} />
      {metadata.keywords && <KeywordsCard keywords={metadata.keywords} />}
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

function BasicMetaCard({ metadata }: { metadata: MetadataInfo }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Metadata</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <MetaRow label="Title" value={metadata.title} />
        <MetaRow label="Description" value={metadata.description} />
        <MetaRow label="Canonical URL" value={metadata.canonical} />
        <MetaRow label="Language" value={metadata.lang} />
        {metadata.author && <MetaRow label="Author" value={metadata.author} />}
      </CardContent>
    </Card>
  );
}

function KeywordsCard({ keywords }: { keywords: string }) {
  const keywordList = keywords.split(",").map((k) => k.trim());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Keywords ({keywordList.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {keywordList.map((keyword) => (
            <span
              key={keyword}
              className="px-2 py-1 text-xs bg-muted rounded-md"
            >
              {keyword}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
