import { cn } from "@/lib/utils";
import React from "react";

export function Container({
  className,
  spacing = "default",
  children,
}: {
  className?: string;
  spacing?: "default" | "lg" | "none";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "max-w-[120rem] mx-auto px-5 sm:px-6 md:px-10",
        spacing === "default" && "py-16 md:py-20",
        spacing === "lg" && "py-16 md:py-28 lg:py-32",
        spacing === "none" && "",
        className
      )}
    >
      {children}
    </div>
  );
}
