import {
  Alert01Icon,
  Download01Icon,
  Image01Icon,
  LicenseNoIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { ImageInfo, MetadataInfo } from "@/types/audit";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ImagesTabProps {
  images: ImageInfo[] | null;
  metadata: MetadataInfo | null;
}

function formatAlt(text: string): string {
  const trimmed = text.trim();
  if (trimmed.length <= 30) {
    return trimmed;
  }
  return `${trimmed.slice(0, 30)}...`;
}

function getImageFormat(src: string): string | null {
  try {
    const url = new URL(src);
    const path = url.pathname.toLowerCase();

    const pathParts = path.split("/").filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1];

    if (lastPart && lastPart.includes(".")) {
      const ext = lastPart.split(".").pop();
      if (
        ext &&
        ["svg", "png", "jpg", "jpeg", "webp", "gif", "avif", "ico"].includes(
          ext
        )
      ) {
        return ext === "jpeg" ? "jpg" : ext;
      }
    }

    for (const part of pathParts) {
      if (part.includes(".")) {
        const ext = part.split(".").pop();
        if (
          ext &&
          ["svg", "png", "jpg", "jpeg", "webp", "gif", "avif", "ico"].includes(
            ext
          )
        ) {
          return ext === "jpeg" ? "jpg" : ext;
        }
      }
    }
  } catch {
    // Invalid URL
  }
  return null;
}

export function ImagesTab({ images, metadata }: ImagesTabProps) {
  const isLoading = images === null;

  const validImages = images?.filter((img) => !img.isBroken) ?? [];

  const missingAltCount = validImages.filter(
    (img) => !img.hasAlt || img.alt === ""
  ).length;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">Icons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-2">
            <IconCard
              label="Favicon"
              url={metadata?.favicon ?? null}
              loading={metadata === null}
            />
            <IconCard
              label="Apple Touch"
              url={metadata?.appleTouchIcon ?? null}
              loading={metadata === null}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-muted-foreground">Images</CardTitle>
          {isLoading && (
            <div className="flex gap-2">
              <Skeleton className="h-5 w-8 rounded" />
            </div>
          )}
          {!isLoading && validImages.length > 0 && (
            <div className="flex gap-2">
              <Badge variant="secondary" className="font-mono">
                {validImages.length}
              </Badge>
              {missingAltCount > 0 && (
                <Badge
                  variant="outline"
                  className="border-orange-400/40 text-orange-200 bg-orange-400/10"
                >
                  <span className="font-mono">{missingAltCount}</span>
                  <span className="font-sans ml-1">missing alt</span>
                </Badge>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="space-y-2">
              <ImageRowSkeleton />
              <ImageRowSkeleton />
              <ImageRowSkeleton />
            </div>
          )}
          {!isLoading && validImages.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
              <HugeiconsIcon
                icon={LicenseNoIcon}
                strokeWidth={2}
                className="size-6"
              />
              <span className="text-sm">No images found</span>
            </div>
          )}
          {!isLoading && validImages.length > 0 && (
            <div className="space-y-2">
              {validImages.map((image, idx) => (
                <ImageRow key={`${image.src}-${idx}`} image={image} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function IconCard({
  label,
  url,
  loading,
}: {
  label: string;
  url: string | null;
  loading: boolean;
}) {
  const content = (
    <>
      <div className="size-8 shrink-0 rounded flex items-center justify-center overflow-hidden">
        {loading && <Skeleton className="size-6 rounded" />}
        {!loading && url && (
          <img src={url} alt={label} className="h-full w-full object-contain" />
        )}
        {!loading && !url && (
          <HugeiconsIcon
            icon={Image01Icon}
            strokeWidth={1.5}
            className="size-5 text-muted-foreground"
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-medium font-sans text-foreground">
          {label}
        </div>
        {loading && <Skeleton className="mt-1 h-3 w-16" />}
        {!loading && !url && (
          <div className="text-[10px] text-muted-foreground font-sans">
            Not found
          </div>
        )}
        {url && !loading && (
          <button
            type="button"
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              try {
                const response = await fetch(url);
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = blobUrl;
                const filename =
                  url.split("/").pop()?.split("?")[0] ||
                  label.toLowerCase().replace(/\s+/g, "-");
                const ext = blob.type.split("/")[1] || "ico";
                link.download = filename.includes(".")
                  ? filename
                  : `${filename}.${ext}`;
                link.click();
                URL.revokeObjectURL(blobUrl);
              } catch (error) {
                console.error("Download failed:", error);
              }
            }}
            className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            aria-label={`Download ${label}`}
          >
            <span className="font-sans">Download</span>
          </button>
        )}
      </div>
    </>
  );

  const className =
    "flex items-center gap-3 rounded-lg bg-muted/20 p-3 hover:bg-white/5 transition-colors select-none";

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return <div className={className}>{content}</div>;
}

function ImageRow({ image }: { image: ImageInfo }) {
  const format = getImageFormat(image.src);
  const hasMissingAlt = !image.hasAlt || image.alt === "";
  const hasWarning = hasMissingAlt;

  const altInfo = (() => {
    if (!image.hasAlt) {
      return { text: "Missing Alt Text", className: "text-orange-200" };
    }
    if (image.alt === "") {
      return { text: "Decorative", className: "text-muted-foreground italic" };
    }
    return { text: image.alt ?? "", className: "text-foreground/90" };
  })();

  const content = (
    <>
      <div className="size-10 shrink-0 rounded flex items-center justify-center overflow-hidden">
        <img
          src={image.src}
          alt={image.alt || ""}
          className="max-h-full max-w-full object-contain"
          loading="lazy"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-sans truncate ${altInfo.className}`}
            title={altInfo.text.trim()}
          >
            {formatAlt(altInfo.text)}
          </span>
          {hasWarning && (
            <HugeiconsIcon
              icon={Alert01Icon}
              strokeWidth={2}
              className="size-3.5 text-orange-200 shrink-0"
            />
          )}
          <span className="flex-1" />
          <button
            type="button"
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              try {
                const response = await fetch(image.src);
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                const filename =
                  image.src.split("/").pop()?.split("?")[0] || "image";
                const ext = format || blob.type.split("/")[1] || "jpg";
                link.download = filename.includes(".")
                  ? filename
                  : `${filename}.${ext}`;
                link.click();
                URL.revokeObjectURL(url);
              } catch (error) {
                console.error("Download failed:", error);
              }
            }}
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Download image"
          >
            <HugeiconsIcon
              icon={Download01Icon}
              strokeWidth={2}
              className="size-4"
            />
          </button>
        </div>
        {(image.width > 0 && image.height > 0) || format ? (
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            {image.width > 0 && image.height > 0 && (
              <span className="font-mono">
                {image.width}x{image.height}
              </span>
            )}
            {format && (
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 h-4 uppercase font-sans"
              >
                {format}
              </Badge>
            )}
          </div>
        ) : null}
      </div>
    </>
  );

  const className =
    "flex items-center gap-3 rounded-md px-2 py-2 hover:bg-white/5 transition-colors select-none";

  return (
    <a
      href={image.src}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} cursor-pointer`}
    >
      {content}
    </a>
  );
}

function ImageRowSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-md px-2 py-2">
      <Skeleton className="size-10 rounded" />
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-3/4" />
          <span className="flex-1" />
          <Skeleton className="size-4 rounded shrink-0" />
        </div>
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
