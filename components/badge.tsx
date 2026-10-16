import { cn } from "@/lib/utils";

export function Badge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "heading text-xs bg-brand rounded-full px-3 py-2 text-white min-w-fit",
        className
      )}
    >
      {children}
    </div>
  );
}
