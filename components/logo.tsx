import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "small" | "medium" | "large";
}

const sizeClasses: Record<Required<LogoProps>["size"], string> = {
  small: "text-base md:text-lg",
  medium: "text-lg md:text-xl",
  large: "text-2xl md:text-3xl",
};

export function Logo({ className, size = "medium" }: LogoProps) {
  return (
    <span
      className={cn(
        "font-heading font-extrabold tracking-tight text-text whitespace-nowrap flex items-baseline gap-1.5",
        sizeClasses[size],
        className
      )}
    >
      <span>Ceretti</span>
      <span className="text-brand">Group</span>
    </span>
  );
}
