import type { Localized } from "@/types";

/**
 * Single source of truth for business information.
 * Replace these values (or feed them from the CRM) without touching components.
 */

export const APP_CONFIG = {
  brand: "ROZIFY AI",
  demoLabel: { fa: "نسخه آزمایشی", en: "DEMO" } satisfies Localized,
  /** Demo mode uses the local mock API layer instead of a real backend. */
  demoMode: (import.meta.env?.["VITE_DEMO_MODE"] ?? "true") !== "false",
  apiBaseUrl: (import.meta.env?.["VITE_API_BASE_URL"] ?? "") as string,
  requestTimeoutMs: 12000,
} as const;

export const BUSINESS = {
  name: { fa: "رزیفای ای‌آی", en: "ROZIFY AI" } satisfies Localized,
  tagline: {
    fa: "دستیار هوشمند زیبایی",
    en: "AI Beauty Assistant",
  } satisfies Localized,
  city: { fa: "تهران، ایران", en: "Tehran, Iran" } satisfies Localized,
  address: {
    fa: "تهران، خیابان نمونه، پلاک ۱۲ (آدرس آزمایشی)",
    en: "12 Sample Street, Tehran (demo address)",
  } satisfies Localized,
  /** Placeholder only — clearly labelled as demo support in the UI. */
  supportPhone: "+98 21 XXX XXXX",
  supportLabel: { fa: "پشتیبانی آزمایشی", en: "Demo Support" } satisfies Localized,
  email: "demo@rozify.ai",
  /** 0 = Sunday … 6 = Saturday */
  openDays: [6, 0, 1, 2, 3, 4],
  workingHours: {
    open: "10:00",
    close: "20:00",
    label: {
      fa: "شنبه تا پنجشنبه، ۱۰:۰۰ تا ۲۰:۰۰",
      en: "Saturday – Thursday, 10:00 – 20:00",
    } satisfies Localized,
    closedLabel: { fa: "جمعه تعطیل", en: "Closed on Friday" } satisfies Localized,
  },
  policies: {
    fa: [
      "لطفاً ۱۰ دقیقه پیش از زمان نوبت در سالن حاضر باشید.",
      "لغو یا تغییر نوبت تا ۲۴ ساعت قبل بدون هزینه امکان‌پذیر است.",
      "برای خدمات عروس، رزرو حداقل دو هفته زودتر توصیه می‌شود.",
    ],
    en: [
      "Please arrive 10 minutes before your appointment time.",
      "Cancellations and changes are free up to 24 hours in advance.",
      "For bridal services we recommend booking at least two weeks ahead.",
    ],
  },
} as const;
