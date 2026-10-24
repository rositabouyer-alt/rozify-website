import { BUSINESS } from "@/config/business";
import { FAQ } from "@/data/faq";
import { SERVICES, SERVICE_CATEGORIES } from "@/data/services";
import type { ChatAction, Language, Service } from "@/types";
import { formatDuration, formatPrice, toEnDigits } from "@/utils/format";
import type { AIProvider, AIResult } from "./types";

/**
 * Rule-based assistant used in demo mode. It answers from the same catalogue
 * the site uses, so it can be swapped for a real LLM without UI changes.
 */

const normalize = (text: string) =>
  toEnDigits(text)
    .toLowerCase()
    .replace(/[،.,!?؟]/g, " ");

function matchService(message: string): Service | undefined {
  const text = normalize(message);
  return SERVICES.find((service) => {
    const fa = service.name.fa.toLowerCase();
    const en = service.name.en.toLowerCase();
    return (
      text.includes(fa) ||
      text.includes(en) ||
      text.includes(service.service_id.replaceAll("_", " "))
    );
  });
}

const has = (text: string, words: string[]) => words.some((word) => text.includes(word));

export function answerLocally(message: string, language: Language): AIResult {
  const text = normalize(message);
  const service = matchService(message);
  const actions: ChatAction[] = [];

  const priceWords = ["قیمت", "هزینه", "چقدر میشه", "چنده", "price", "cost", "how much"];
  const timeWords = [
    "چقدر طول",
    "مدت",
    "زمان می‌بره",
    "زمان میبره",
    "how long",
    "duration",
    "take",
  ];
  const bookWords = ["نوبت", "رزرو", "وقت", "book", "appointment", "reserve", "available"];
  const listWords = ["چه خدماتی", "خدمات", "لیست", "services", "what do you offer", "menu"];

  if (service && has(text, priceWords)) {
    actions.push({ type: "select_service", service_id: service.service_id });
    return {
      message:
        language === "fa"
          ? `قیمت ${service.name.fa} ${formatPrice(service.price, "fa")} است و حدود ${formatDuration(
              service.duration_minutes,
              "fa",
            )} زمان می‌برد. اگر بخواهید می‌توانم شما را به صفحه رزرو ببرم.`
          : `${service.name.en} costs ${formatPrice(service.price, "en")} and takes about ${formatDuration(
              service.duration_minutes,
              "en",
            )}. I can take you to the booking page if you like.`,
      actions,
    };
  }

  if (service && has(text, timeWords)) {
    actions.push({ type: "select_service", service_id: service.service_id });
    return {
      message:
        language === "fa"
          ? `${service.name.fa} حدود ${formatDuration(service.duration_minutes, "fa")} زمان می‌برد (${formatPrice(
              service.price,
              "fa",
            )}).`
          : `${service.name.en} takes around ${formatDuration(service.duration_minutes, "en")} (${formatPrice(
              service.price,
              "en",
            )}).`,
      actions,
    };
  }

  if (has(text, bookWords)) {
    actions.push({ type: "open_booking", ...(service ? { service_id: service.service_id } : {}) });
    return {
      message:
        language === "fa"
          ? `بله، رزرو نوبت از طریق صفحه رزرو انجام می‌شود؛ آنجا خدمت، تاریخ و ساعت‌های خالی را می‌بینید${
              service ? ` — خدمت ${service.name.fa} را برایتان انتخاب می‌کنم.` : "."
            }`
          : `Yes — appointments are made on the booking page, where you can see the available times${
              service ? `. I'll preselect ${service.name.en} for you.` : "."
            }`,
      actions,
    };
  }

  if (service) {
    actions.push({ type: "select_service", service_id: service.service_id });
    return {
      message:
        language === "fa"
          ? `${service.name.fa}: ${service.description.fa} قیمت ${formatPrice(
              service.price,
              "fa",
            )} و مدت ${formatDuration(service.duration_minutes, "fa")}.`
          : `${service.name.en}: ${service.description.en} Price ${formatPrice(
              service.price,
              "en",
            )}, duration ${formatDuration(service.duration_minutes, "en")}.`,
      actions,
    };
  }

  const faq = FAQ.find((item) =>
    has(
      text,
      item.keywords.map((keyword) => keyword.toLowerCase()),
    ),
  );
  if (faq) {
    return {
      message: faq.answer[language],
      actions: faq.faq_id === "location" ? [{ type: "show_contact" }] : [],
    };
  }

  if (has(text, listWords)) {
    const categories = SERVICE_CATEGORIES.map((category) => category.name[language]).join("، ");
    return {
      message:
        language === "fa"
          ? `ما در ${SERVICE_CATEGORIES.length} دسته خدمت ارائه می‌دهیم: ${categories}. اسم خدمت موردنظرتان را بگویید تا قیمت و زمانش را بگویم.`
          : `We offer services in ${SERVICE_CATEGORIES.length} categories: ${categories}. Tell me a service name and I'll share its price and duration.`,
      actions: [],
    };
  }

  return {
    message:
      language === "fa"
        ? `می‌توانم درباره خدمات، قیمت‌ها، مدت زمان، ساعت کاری (${BUSINESS.workingHours.label.fa}) و رزرو نوبت کمکتان کنم. سؤالتان را دقیق‌تر بفرمایید.`
        : `I can help with services, prices, durations, opening hours (${BUSINESS.workingHours.label.en}) and bookings. Could you tell me a bit more?`,
    actions: [],
  };
}

export const demoProvider: AIProvider = {
  name: "demo",
  chat: async ({ message, language }) => answerLocally(message, language),
};
