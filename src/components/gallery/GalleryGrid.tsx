import { GALLERY } from "@/data/gallery";
import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

export function GalleryGrid({ limit }: { limit?: number }) {
  const { language } = useLanguage();
  const items = limit ? GALLERY.slice(0, limit) : GALLERY;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {items.map((item, index) => (
        <figure
          key={item.gallery_id}
          className={cn(
            "group relative overflow-hidden rounded-2xl bg-muted",
            index === 0 && "col-span-2 row-span-2 sm:col-span-2",
          )}
        >
          <img
            src={item.src}
            alt={item.alt[language]}
            loading="lazy"
            width={912}
            height={1104}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <figcaption className="absolute bottom-3 start-3 rounded-full bg-card/85 px-3 py-1 text-xs tracking-wide text-foreground backdrop-blur">
            {item.label[language]}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
