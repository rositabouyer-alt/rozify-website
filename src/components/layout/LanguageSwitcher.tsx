import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-primary/25 bg-card/70 p-1 text-sm",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {(["fa", "en"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLanguage(code)}
          aria-pressed={language === code}
          className={cn(
            "rounded-full px-3 py-1 transition-colors duration-300",
            language === code
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {code === "fa" ? "فارسی" : "EN"}
        </button>
      ))}
    </div>
  );
}
