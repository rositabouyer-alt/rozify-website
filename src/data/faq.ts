import type { Localized } from "@/types";

export interface FaqItem {
  faq_id: string;
  question: Localized;
  answer: Localized;
  /** Keywords the demo assistant matches against (both languages). */
  keywords: string[];
}

export const FAQ: FaqItem[] = [
  {
    faq_id: "working_hours",
    question: { fa: "ساعت کاری سالن چطور است؟", en: "What are your opening hours?" },
    answer: {
      fa: "ما شنبه تا پنجشنبه از ساعت ۱۰:۰۰ تا ۲۰:۰۰ پذیرای شما هستیم. جمعه‌ها تعطیل است.",
      en: "We are open Saturday to Thursday, 10:00 to 20:00. We are closed on Friday.",
    },
    keywords: ["ساعت", "کاری", "باز", "تعطیل", "hours", "open", "close", "time"],
  },
  {
    faq_id: "location",
    question: { fa: "سالن کجاست؟", en: "Where are you located?" },
    answer: {
      fa: "ما در تهران، ایران هستیم. آدرس دقیق در بخش تماس نمایش داده شده است (اطلاعات آزمایشی).",
      en: "We are in Tehran, Iran. The exact address is in the contact section (demo data).",
    },
    keywords: ["کجا", "آدرس", "مکان", "تهران", "where", "address", "location", "map"],
  },
  {
    faq_id: "cancellation",
    question: { fa: "چطور نوبتم را لغو یا تغییر دهم؟", en: "How do I change or cancel a booking?" },
    answer: {
      fa: "تا ۲۴ ساعت قبل از نوبت می‌توانید بدون هزینه آن را لغو یا جابه‌جا کنید. کافی است کد رزرو خود را به ما بدهید.",
      en: "You can cancel or move your appointment free of charge up to 24 hours beforehand — just share your booking code.",
    },
    keywords: ["لغو", "کنسل", "تغییر", "جابه‌جا", "cancel", "change", "reschedule", "move"],
  },
  {
    faq_id: "policies",
    question: { fa: "قوانین سالن چیست؟", en: "What are your salon policies?" },
    answer: {
      fa: "لطفاً ۱۰ دقیقه زودتر تشریف بیاورید، لغو تا ۲۴ ساعت قبل رایگان است و برای خدمات عروس رزرو زودهنگام توصیه می‌شود.",
      en: "Please arrive 10 minutes early, cancellations are free up to 24 hours ahead, and bridal services should be booked well in advance.",
    },
    keywords: ["قوانین", "شرایط", "policy", "policies", "rules", "terms"],
  },
  {
    faq_id: "payment",
    question: { fa: "پرداخت چگونه انجام می‌شود؟", en: "How does payment work?" },
    answer: {
      fa: "در این نسخه آزمایشی پرداخت آنلاین فعال نیست؛ تسویه در محل سالن انجام می‌شود.",
      en: "Online payment is not enabled in this demo; payment is settled at the salon.",
    },
    keywords: ["پرداخت", "قیمت کل", "کارت", "payment", "pay", "card"],
  },
];
