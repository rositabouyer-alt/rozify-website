import { createFileRoute, Link } from "@tanstack/react-router";
import heroImage from "@/assets/hero.jpg";
import { Button } from "@/components/common/Button";
import { Section } from "@/components/common/Section";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { ServiceCard } from "@/components/services/ServiceCard";
import { useServices } from "@/hooks/useServices";
import { useLanguage } from "@/i18n/LanguageProvider";
import { BUSINESS } from "@/config/business";
import { FAQ } from "@/data/faq";
import { formatNumber } from "@/utils/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ROZIFY AI — سالن زیبایی هوشمند بانوان | Smart Beauty Salon" },
      {
        name: "description",
        content:
          "ROZIFY AI: bilingual women's beauty salon with hair, makeup, brows, nails and skin services, instant booking and a 24/7 AI beauty assistant.",
      },
      { property: "og:title", content: "ROZIFY AI — Smart Beauty Salon" },
      {
        property: "og:description",
        content:
          "Transparent prices, easy appointment booking and a smart beauty assistant in Persian and English.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { t, language } = useLanguage();
  const { services } = useServices();
  const featured = services.filter((service) => service.featured).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden bg-soft">
        <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-up">
            <p className="eyebrow">{t.hero.eyebrow}</p>
            <h1 className="mt-4 font-display text-5xl leading-[1.08] sm:text-6xl lg:text-7xl">
              {t.hero.title}
            </h1>
            <p className="mt-3 text-lg text-primary">{t.hero.subtitle}</p>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
              {t.hero.description}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/booking">
                <Button size="lg">{t.common.bookNow}</Button>
              </Link>
              <Link to="/services">
                <Button size="lg" variant="outline">
                  {t.common.exploreServices}
                </Button>
              </Link>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-border/70 pt-8">
              <Stat value={formatNumber(services.length, language)} label={t.hero.stat1} />
              <Stat value={formatNumber(BUSINESS.openDays.length, language)} label={t.hero.stat2} />
              <Stat value={language === "fa" ? "۲۴/۷" : "24/7"} label={t.hero.stat3} />
            </dl>
          </div>

          <div className="relative animate-fade-in">
            <div className="overflow-hidden rounded-[2rem] shadow-lift">
              <img
                src={heroImage}
                alt={
                  language === "fa"
                    ? "فضای آرام سالن زیبایی رزیفای"
                    : "Calm interior of the Rozify beauty salon"
                }
                width={1280}
                height={1600}
                loading="eager"
                className="h-[26rem] w-full object-cover object-center sm:h-[34rem] lg:h-[38rem]"
              />
            </div>
          </div>
        </div>
      </section>

      <Section
        eyebrow={t.services.eyebrow}
        title={t.services.featuredTitle}
        description={t.services.featuredDescription}
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((service) => (
            <ServiceCard key={service.service_id} service={service} />
          ))}
        </div>
        <div className="mt-10">
          <Link to="/services">
            <Button variant="outline">{t.common.viewAll}</Button>
          </Link>
        </div>
      </Section>

      <Section className="bg-soft" eyebrow={t.why.eyebrow} title={t.why.title}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.why.items.map((item) => (
            <div key={item.title} className="rounded-2xl bg-card p-6 shadow-soft">
              <h3 className="font-display text-xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow={t.gallery.eyebrow}
        title={t.gallery.title}
        description={t.gallery.description}
      >
        <GalleryGrid limit={4} />
        <div className="mt-10">
          <Link to="/gallery">
            <Button variant="outline">{t.common.viewAll}</Button>
          </Link>
        </div>
      </Section>

      <Section className="bg-soft" eyebrow={t.contact.eyebrow} title={t.contact.title}>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-card p-8 shadow-soft">
            <dl className="space-y-4 text-sm">
              <Row label={t.contact.address} value={BUSINESS.address[language]} />
              <Row label={t.contact.phone} value={BUSINESS.supportPhone} />
              <Row label={t.contact.email} value={BUSINESS.email} />
              <Row label={t.contact.hours} value={BUSINESS.workingHours.label[language]} />
            </dl>
            <div className="mt-8">
              <Link to="/contact">
                <Button variant="outline" size="sm">
                  {t.nav.contact}
                </Button>
              </Link>
            </div>
          </div>
          <div className="rounded-2xl bg-card p-8 shadow-soft">
            <h3 className="font-display text-2xl">
              {language === "fa" ? "سوالات پرتکرار" : "Frequently asked"}
            </h3>
            <div className="mt-6 space-y-5">
              {FAQ.slice(0, 3).map((item) => (
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
      </Section>

      <section className="py-20">
        <div className="container-page rounded-[2rem] bg-primary px-8 py-14 text-center text-primary-foreground sm:px-16">
          <h2 className="font-display text-4xl sm:text-5xl">{t.booking.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed opacity-90">
            {t.booking.description}
          </p>
          <div className="mt-8 flex justify-center">
            <Link to="/booking">
              <Button size="lg" variant="accent">
                {t.common.bookNow}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="font-display text-3xl text-foreground">{value}</dt>
      <dd className="mt-1 text-xs leading-snug text-muted-foreground">{label}</dd>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-foreground">{value}</dd>
    </div>
  );
}
