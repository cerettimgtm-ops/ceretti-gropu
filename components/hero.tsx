import { cn } from "@/lib/utils";

interface HeroProps {
  children: React.ReactNode;
  className?: string;
}

interface HeroElementsProps {
  children: React.ReactNode;
  className?: string;
}

export const HeroTitle = ({ children, className }: HeroElementsProps) => {
  return (
    <h1
      className={cn(
        "heading text-6xl md:text-7xl xl:text-9xl leading-[0.98] text-balance xl:text-left text-center text-text",
        className
      )}
    >
      {children}
    </h1>
  );
};

export const HeroSubTitle = ({ children, className }: HeroElementsProps) => {
  return (
    <p
      className={cn(
        "text-lg md:text-xl leading-relaxed font-medium text-text text-center xl:text-left max-w-xl",
        className
      )}
    >
      {children}
    </p>
  );
};

export const Hero = ({ children, className }: HeroProps) => {
  return <div className={cn("", className)}>{children}</div>;
};
