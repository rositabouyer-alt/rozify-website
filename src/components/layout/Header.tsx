import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/common/Button";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/services", label: t.nav.services },
    { to: "/gallery", label: t.nav.gallery },
    { to: "/booking", label: t.nav.booking },
    { to: "/contact", label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-baseline gap-2"
          onClick={() => setOpen(false)}
        >
          <span className="font-display text-2xl tracking-[0.18em] text-foreground">
            ROZIFY
          </span>

          <span className="font-display text-2xl tracking-[0.18em] text-primary">
            AI
          </span>
        </Link>

        <nav
          className="hidden items-center gap-8 lg:flex"
          aria-label={t.nav.menu}
        >
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
              activeOptions={{ exact: link.to === "/" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher className="hidden sm:inline-flex" />

          <Link to="/booking" className="hidden lg:block">
            <Button size="sm">{t.common.bookNow}</Button>
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border lg:hidden"
            aria-expanded={open}
            aria-label={open ? t.nav.close : t.nav.menu}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">
              {open ? t.nav.close : t.nav.menu}
            </span>

            <div className="space-y-1.5" aria-hidden>
              <span
                className={cn(
                  "block h-px w-5 bg-foreground transition-transform",
                  open && "translate-y-[6px] rotate-45",
                )}
              />

              <span
                className={cn(
                  "block h-px w-5 bg-foreground transition-opacity",
                  open && "opacity-0",
                )}
              />

              <span
                className={cn(
                  "block h-px w-5 bg-foreground transition-transform",
                  open && "-translate-y-[6px] -rotate-45",
                )}
              />
            </div>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-card lg:hidden">
          <nav
            className="container-page flex flex-col py-4"
            aria-label={t.nav.menu}
          >
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="py-3 text-base text-foreground/80 transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}

            <LanguageSwitcher className="mt-3 self-start sm:hidden" />
          </nav>
        </div>
      )}
    </header>
  );
}