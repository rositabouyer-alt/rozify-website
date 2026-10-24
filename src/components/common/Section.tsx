import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  center?: boolean;
}

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  center,
}: SectionProps) {
  return (
    <section id={id} className={cn("py-20 sm:py-28", className)}>
      <div className="container-page">
        {(eyebrow || title || description) && (
          <header className={cn("max-w-2xl", center && "mx-auto text-center")}>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h2 className="mt-3 text-4xl leading-tight sm:text-5xl">{title}</h2>}
            {description && (
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">{description}</p>
            )}
          </header>
        )}
        <div className={cn(eyebrow || title ? "mt-12" : "")}>{children}</div>
      </div>
    </section>
  );
}
