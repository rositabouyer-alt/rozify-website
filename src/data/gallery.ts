import galleryHair from "@/assets/gallery-hair.jpg";
import galleryMakeup from "@/assets/gallery-makeup.jpg";
import galleryNails from "@/assets/gallery-nails.jpg";
import gallerySkin from "@/assets/gallery-skin.jpg";
import galleryBrows from "@/assets/gallery-brows.jpg";
import gallerySalon from "@/assets/gallery-salon.jpg";
import type { Localized } from "@/types";

export interface GalleryItem {
  gallery_id: string;
  src: string;
  alt: Localized;
  label: Localized;
}

export const GALLERY: GalleryItem[] = [
  {
    gallery_id: "hair",
    src: galleryHair,
    alt: { fa: "موی بالیاژ شده با سایه‌روشن طبیعی", en: "Balayage hair with soft natural tones" },
    label: { fa: "مو", en: "Hair" },
  },
  {
    gallery_id: "makeup",
    src: galleryMakeup,
    alt: { fa: "میکاپ ملایم عروس", en: "Soft glam bridal makeup" },
    label: { fa: "میکاپ", en: "Makeup" },
  },
  {
    gallery_id: "brows",
    src: galleryBrows,
    alt: { fa: "ابروی لمینت‌شده و مژه لیفت‌شده", en: "Laminated brows and lifted lashes" },
    label: { fa: "ابرو و مژه", en: "Brows & Lashes" },
  },
  {
    gallery_id: "nails",
    src: galleryNails,
    alt: { fa: "ناخن‌های مانیکور شده با لاک نود", en: "Manicured nails in a nude finish" },
    label: { fa: "ناخن", en: "Nails" },
  },
  {
    gallery_id: "skin",
    src: gallerySkin,
    alt: { fa: "جلسه فیشیال در اتاق درمان", en: "Facial treatment in the care room" },
    label: { fa: "پوست", en: "Skin" },
  },
  {
    gallery_id: "salon",
    src: gallerySalon,
    alt: { fa: "فضای داخلی سالن", en: "Interior of the salon" },
    label: { fa: "سالن", en: "Salon" },
  },
];
