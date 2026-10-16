import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BaseElementProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  className?: string;
}

export const Title = ({ children, className, ...props }: BaseElementProps) => {
  return (
    <h3
      className={cn(
        "heading text-3xl md:text-4xl leading-[1.05] text-brand mb-4",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

export const SubTitle = ({ children, className, ...props }: BaseElementProps) => {
  return (
    <p
      className={cn("text-lg leading-relaxed font-medium text-text", className)}
      {...props}
    >
      {children}
    </p>
  );
};

export const Feature = ({ children, className, ...props }: BaseElementProps) => {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
};

export const FeatureHighlight = ({
  children,
  className,
  ...props
}: BaseElementProps) => {
  return (
    <div
      className={cn(
        "text-brand text-sm font-semibold flex items-center gap-2 mb-3",
        className
      )}
      {...props}
    >
      {children}
      <div className="w-15 h-[.5px] bg-brand shrink-0" aria-hidden="true" />
    </div>
  );
};
