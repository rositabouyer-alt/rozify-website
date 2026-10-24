import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/common/Section";
import { ServicesExplorer } from "@/components/services/ServicesExplorer";
import { useLanguage } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "خدمات و قیمت‌ها | Services & Prices — ROZIFY AI" },
      {
        name: "description",
        content:
          "Hair, makeup, brows and lashes, nails and skin treatments at ROZIFY AI, each with a clear price, duration and category.",
      },
      { property: "og:title", content: "Services & Prices — ROZIFY AI" },
      {
        property: "og:description",
        content: "Browse every ROZIFY AI beauty service with transparent pricing and durations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { t } = useLanguage();
  return (
    <Section
      eyebrow={t.services.eyebrow}
      title={t.services.title}
      description={t.services.description}
    >
      <ServicesExplorer />
    </Section>
  );
}
