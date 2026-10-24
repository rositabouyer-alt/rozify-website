import { createFileRoute, Link } from "@tanstack/react-router";
import gallerySalon from "@/assets/gallery-salon.jpg";
import { Section } from "@/components/common/Section";
import { Button } from "@/components/common/Button";
import { BUSINESS } from "@/config/business";
import { FAQ } from "@/data/faq";
import { useLanguage } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "تماس و موقعیت | Contact — ROZIFY AI" },
      {
        name: "description",
        content:
          "Contact ROZIFY AI: address, phone, email, opening hours and salon policies, plus answers to common questions.",
      },
      { property: "og:title", content: "Contact — ROZIFY AI" },
      {
        property: "og:description",
        content: "Address, opening hours and salon policies for the ROZIFY AI beauty salon.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t, language } = useLanguage();

  return (
    <Section
      eyebrow={t.contact.eyebrow}
      title={t.contact.title}
      description={t.contact.description}
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-2xl bg-card p-8 shadow-soft">
            <dl className="space-y-5 text-sm">
              <Row label={t.contact.address} value={BUSINESS.address[language]} />
              <Row
                label={t.contact.phone}
                value={`${BUSINESS.supportPhone} · ${BUSINESS.supportLabel[language]}`}
              />
              <Row label={t.contact.email} value={BUSINESS.email} />
              <Row label={t.contact.hours} value={BUSINESS.workingHours.label[language]} />
              <Row label="" value={BUSINESS.workingHours.closedLabel[language]} />
            </dl>
            <p className="mt-6 text-xs text-muted-foreground">{t.common.demoNotice}</p>
            <div className="mt-6">
              <Link to="/booking">
                <Button size="sm">{t.common.bookNow}</Button>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-soft p-8">
            <h3 className="font-display text-2xl">{t.contact.policies}</h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {BUSINESS.policies[language].map((policy) => (
                <li key={policy} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                  <span>{policy}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl shadow-soft">
            <img
              src={gallerySalon}
              alt={language === "fa" ? "فضای داخلی سالن" : "Interior of the salon"}
              width={912}
              height={1104}
              loading="lazy"
              className="h-72 w-full object-cover object-center"
            />
          </div>
          <div className="rounded-2xl bg-card p-8 shadow-soft">
            <h3 className="font-display text-2xl">
              {language === "fa" ? "سوالات پرتکرار" : "Frequently asked"}
            </h3>
            <div className="mt-6 space-y-5">
              {FAQ.map((item) => (
                <div key={item.faq_id}>
                  <p className="text-sm font-medium text-foreground">{item.question[language]}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {item.answer[language]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      {label && (
        <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</dt>
      )}
      <dd className="mt-1 text-foreground">{value}</dd>
    </div>
  );
}
