import type { Language, Localized } from "@/types";

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export const toFaDigits = (value: string): string =>
  value.replace(/\d/g, (digit) => FA_DIGITS[Number(digit)]!);

export const toEnDigits = (value: string): string =>
  value.replace(/[۰-۹٠-٩]/g, (digit) =>
    String(
      "۰۱۲۳۴۵۶۷۸۹".indexOf(digit) >= 0 ? "۰۱۲۳۴۵۶۷۸۹".indexOf(digit) : "٠١٢٣٤٥٦٧٨٩".indexOf(digit),
    ),
  );

export const localized = (value: Localized, language: Language): string => value[language];

/** IRR amounts are displayed in Toman (1 Toman = 10 Rial is NOT applied here:
 *  prices in the catalogue are already stored as Toman-facing amounts). */
export function formatPrice(amount: number, language: Language): string {
  const grouped = amount.toLocaleString("en-US");
  return language === "fa" ? `${toFaDigits(grouped)} تومان` : `${grouped} Toman`;
}

export function formatDuration(minutes: number, language: Language): string {
  if (language === "fa") {
    if (minutes < 60) return `${toFaDigits(String(minutes))} دقیقه`;
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    return rest === 0
      ? `${toFaDigits(String(hours))} ساعت`
      : `${toFaDigits(String(hours))} ساعت و ${toFaDigits(String(rest))} دقیقه`;
  }
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
}

export function formatDate(isoDate: string, language: Language): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return new Intl.DateTimeFormat(language === "fa" ? "fa-IR" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

export function formatTime(time: string, language: Language): string {
  return language === "fa" ? toFaDigits(time) : time;
}

export function formatNumber(value: number, language: Language): string {
  const text = value.toLocaleString("en-US");
  return language === "fa" ? toFaDigits(text) : text;
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Accepts Iranian mobile/landline formats, tolerant of spaces and Persian digits. */
export function isValidPhone(input: string): boolean {
  const normalized = toEnDigits(input).replace(/[\s()-]/g, "");
  return /^(\+98|0098|0)?9\d{9}$/.test(normalized) || /^(\+98|0)?\d{2,3}\d{7,8}$/.test(normalized);
}
