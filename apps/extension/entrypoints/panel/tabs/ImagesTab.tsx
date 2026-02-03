import type { ImageInfo } from "@/types/audit";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ImagesTabProps {
  images: ImageInfo[] | null;
}

export function ImagesTab({ images }: ImagesTabProps) {
  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">No images found on this page</p>
      </div>
    );
  }

  const imagesWithoutAlt = images.filter((img) => !img.hasAlt);
  const imagesWithEmptyAlt = images.filter(
    (img) => img.hasAlt && img.alt === ""
  );
  const imagesWithAlt = images.filter((img) => img.hasAlt && img.alt !== "");

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>All Images ({images.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground mb-3">
            {imagesWithoutAlt.length > 0 && (
              <div className="text-destructive">
                {imagesWithoutAlt.length} missing alt attribute
              </div>
            )}
            {imagesWithEmptyAlt.length > 0 && (
              <div className="text-yellow-600 dark:text-yellow-400">
                {imagesWithEmptyAlt.length} decorative (empty alt)
              </div>
            )}
            {imagesWithAlt.length > 0 && (
              <div className="text-green-600 dark:text-green-400">
                {imagesWithAlt.length} with alt text
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {imagesWithoutAlt.length > 0 && (
        <ImageGroup
          title={`Missing Alt (${imagesWithoutAlt.length})`}
          images={imagesWithoutAlt}
          variant="error"
        />
      )}

      {imagesWithEmptyAlt.length > 0 && (
        <ImageGroup
          title={`Decorative Images (${imagesWithEmptyAlt.length})`}
          images={imagesWithEmptyAlt}
          variant="warning"
        />
      )}

      {imagesWithAlt.length > 0 && (
        <ImageGroup
          title={`With Alt Text (${imagesWithAlt.length})`}
          images={imagesWithAlt}
          variant="success"
        />
      )}
    </div>
  );
}

interface ImageGroupProps {
  title: string;
  images: ImageInfo[];
  variant: "error" | "warning" | "success";
}

function ImageGroup({ title, images, variant }: ImageGroupProps) {
  const borderColor = {
    error: "border-destructive/50",
    warning: "border-yellow-500/50",
    success: "border-green-500/50",
  }[variant];

  return (
    <Card className={borderColor}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {images.map((img) => (
          <ImageRow key={img.src} image={img} variant={variant} />
        ))}
      </CardContent>
    </Card>
  );
}

interface ImageRowProps {
  image: ImageInfo;
  variant: "error" | "warning" | "success";
}

function ImageRow({ image, variant }: ImageRowProps) {
  const bgColor = {
    error: "bg-destructive/5",
    warning: "bg-yellow-500/5",
    success: "bg-green-500/5",
  }[variant];

  return (
    <div className={`flex items-start gap-3 p-2 rounded-md ${bgColor}`}>
      <div className="w-8 h-8 flex-shrink-0 bg-muted rounded overflow-hidden border border-border">
        <img
          src={image.src}
          alt={image.alt || ""}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="text-xs">
          {!image.hasAlt && (
            <span className="text-destructive font-medium">
              No alt attribute
            </span>
          )}
          {image.hasAlt && image.alt === "" && (
            <span className="text-yellow-600 dark:text-yellow-400 italic">
              Empty alt (decorative)
            </span>
          )}
          {image.hasAlt && image.alt !== "" && (
            <span className="text-foreground">{image.alt}</span>
          )}
        </div>

        <div className="text-[10px] text-muted-foreground flex gap-2">
          {image.width > 0 && image.height > 0 && (
            <span>
              {image.width} × {image.height}
            </span>
          )}
        </div>

        <div
          className="text-[10px] text-muted-foreground truncate"
          title={image.src}
        >
          {image.src}
        </div>
      </div>
    </div>
  );
}
