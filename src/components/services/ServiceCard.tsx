import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { Service } from "@/types";
import { formatDuration, formatPrice } from "@/utils/format";

export function ServiceCard({ service }: { service: Service }) {
  const { language, t } = useLanguage();

  return (
    <article className="group flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-2xl leading-snug">{service.name[language]}</h3>
          <span className="whitespace-nowrap rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
            {formatDuration(service.duration_minutes, language)}
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {service.description[language]}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
        <span className="text-sm font-medium text-primary">
          {formatPrice(service.price, language)}
        </span>
        <Link
          to="/booking"
          search={{ service: service.service_id }}
          className="text-sm text-foreground/70 underline-offset-4 transition-colors hover:text-primary hover:underline"
        >
          {t.services.book}
        </Link>
      </div>
    </article>
  );
}
