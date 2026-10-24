import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/common/Section";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { useLanguage } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "گالری نمونه کارها | Gallery — ROZIFY AI" },
      {
        name: "description",
        content:
          "A look inside the ROZIFY AI salon: hair colour, bridal makeup, brows and lashes, nails and skin treatments.",
      },
      { property: "og:title", content: "Gallery — ROZIFY AI" },
      {
        property: "og:description",
        content: "Selected work and the calm interior of the ROZIFY AI beauty salon.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { t } = useLanguage();
  return (
    <Section
      eyebrow={t.gallery.eyebrow}
      title={t.gallery.title}
      description={t.gallery.description}
    >
      <GalleryGrid />
    </Section>
  );
}
