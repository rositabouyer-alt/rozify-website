import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useServices } from "@/hooks/useServices";
import { cn } from "@/lib/utils";
import type { ServiceCategoryId } from "@/types";
import { ServiceCard } from "./ServiceCard";

export function ServicesExplorer() {
  const { language, t } = useLanguage();
  const { services, categories } = useServices();
  const [active, setActive] = useState<ServiceCategoryId | "all">("all");

  const visible = active === "all" ? services : services.filter((item) => item.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={t.services.title}>
        <FilterButton active={active === "all"} onClick={() => setActive("all")}>
          {t.services.all}
        </FilterButton>
        {categories.map((category) => (
          <FilterButton
            key={category.category_id}
            active={active === category.category_id}
            onClick={() => setActive(category.category_id)}
          >
            {category.name[language]}
          </FilterButton>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 text-sm text-muted-foreground">{t.services.empty}</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((service) => (
            <ServiceCard key={service.service_id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm transition-colors duration-300",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
