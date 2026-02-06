import { cn } from "@/lib/utils";

function Skeleton({ className, style, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-primary/10 rounded-md animate-shimmer", className)}
      style={{
        backgroundImage:
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
        backgroundSize: "200% 100%",
        ...style,
      }}
      {...props}
    />
  );
}

export { Skeleton };
