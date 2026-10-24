import { BUSINESS } from "@/config/business";
import { FAQ } from "@/data/faq";
import { SERVICES } from "@/data/services";
import type { Language } from "@/types";
import { formatDuration, formatPrice } from "@/utils/format";

/**
 * Builds the grounding context handed to any AI provider. It is derived from
 * the same catalogue the website uses, so prices can never drift apart.
 */
export function buildKnowledgeContext(language: Language): string {
  const services = SERVICES.map(
    (service) =>
      `- ${service.service_id} | ${service.name[language]} | ${formatPrice(service.price, language)} | ${formatDuration(
        service.duration_minutes,
        language,
      )} | ${service.category}`,
  ).join("\n");

  const faq = FAQ.map((item) => `- ${item.question[language]} => ${item.answer[language]}`).join(
    "\n",
  );

  return [
    `Salon: ${BUSINESS.name[language]} (${BUSINESS.tagline[language]})`,
    `Location: ${BUSINESS.city[language]}`,
    `Working hours: ${BUSINESS.workingHours.label[language]}`,
    `Support (demo only): ${BUSINESS.supportPhone}`,
    "",
    "SERVICES (id | name | price | duration | category):",
    services,
    "",
    "FAQ:",
    faq,
    "",
    "POLICIES:",
    BUSINESS.policies[language].map((line) => `- ${line}`).join("\n"),
  ].join("\n");
}

export function buildSystemPrompt(language: Language): string {
  const rules =
    language === "fa"
      ? [
          "تو دستیار هوشمند سالن زیبایی «رزیفای ای‌آی» هستی.",
          "همیشه فارسی، کوتاه، حرفه‌ای و مؤدب پاسخ بده.",
          "قیمت‌ها و مدت‌زمان‌ها را فقط از داده‌های زیر بگو و چیزی از خودت نساز.",
          "اگر اطلاعاتی نداری، صادقانه بگو و کاربر را به صفحه رزرو یا تماس راهنمایی کن.",
          "این نسخه آزمایشی است؛ رزرو نهایی در صفحه رزرو انجام می‌شود.",
        ]
      : [
          "You are the AI assistant of the ROZIFY AI beauty salon.",
          "Always answer in English, briefly, professionally and warmly.",
          "Use only the data below for prices and durations; never invent numbers.",
          "If you don't know something, say so and point the user to the booking or contact page.",
          "This is a demo version; final booking happens on the booking page.",
        ];

  return `${rules.join("\n")}\n\n${buildKnowledgeContext(language)}`;
}
