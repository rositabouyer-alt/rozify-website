import { Link } from "@tanstack/react-router";
import { APP_CONFIG, BUSINESS } from "@/config/business";
import { useLanguage } from "@/i18n/LanguageProvider";

export function Footer() {
  const { t, language } = useLanguage();

  const links = [
    { to: "/services", label: t.nav.services },
    { to: "/gallery", label: t.nav.gallery },
    { to: "/booking", label: t.nav.booking },
    { to: "/contact", label: t.nav.contact },
  ];

  return (
    <footer className="border-t border-border bg-muted/60">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <p className="font-display text-2xl tracking-[0.18em]">
            ROZIFY <span className="text-primary">AI</span>
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {BUSINESS.tagline[language]} — {t.common.demoNotice}
          </p>
        </div>

        <nav aria-label={t.footer.quickLinks}>
          <h3 className="text-sm font-medium tracking-wide">{t.footer.quickLinks}</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {links.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-sm text-muted-foreground">
          <h3 className="text-sm font-medium tracking-wide text-foreground">{t.contact.title}</h3>
          <p className="mt-4">{BUSINESS.city[language]}</p>
          <p className="mt-2" dir="ltr">
            {BUSINESS.supportPhone}
          </p>
          <p className="mt-1 text-xs">{BUSINESS.supportLabel[language]}</p>
          <p className="mt-2">{BUSINESS.workingHours.label[language]}</p>
        </div>
      </div>

      <div className="border-t border-border/80">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {APP_CONFIG.brand}. {t.footer.rights}
          </span>
          <span>{t.footer.builtWith}</span>
        </div>
      </div>
    </footer>
  );
}
