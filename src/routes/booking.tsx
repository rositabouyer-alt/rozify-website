import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/common/Section";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { useLanguage } from "@/i18n/LanguageProvider";

type BookingSearch = { service?: string | undefined };

export const Route = createFileRoute("/booking")({
  validateSearch: (search: Record<string, unknown>): BookingSearch => ({
    service: typeof search["service"] === "string" ? (search["service"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "رزرو نوبت | Book an Appointment — ROZIFY AI" },
      {
        name: "description",
        content:
          "Book a ROZIFY AI appointment in a few steps: choose your service, date, available time and confirm your details.",
      },
      { property: "og:title", content: "Book an Appointment — ROZIFY AI" },
      {
        property: "og:description",
        content: "Live availability and instant confirmation for every ROZIFY AI beauty service.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BookingPage,
});

function BookingPage() {
  const { t } = useLanguage();
  const { service } = Route.useSearch();

  return (
    <Section
      eyebrow={t.booking.eyebrow}
      title={t.booking.title}
      description={t.booking.description}
    >
      <BookingFlow {...(service ? { initialServiceId: service } : {})} />
    </Section>
  );
}
