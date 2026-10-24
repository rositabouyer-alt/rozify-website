import type { Service, ServiceCategory } from "@/types";

/**
 * THE single source of truth for services, prices and durations.
 * Website, booking flow, chatbot and CRM export all read from here.
 * Replace with a backend fetch by changing src/services/api/serviceApi.ts only.
 */

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    category_id: "hair",
    name: { fa: "مو", en: "Hair" },
    description: {
      fa: "کوتاهی، رنگ و مراقبت تخصصی مو",
      en: "Cutting, colour and specialist hair care",
    },
  },
  {
    category_id: "makeup",
    name: { fa: "میکاپ", en: "Makeup" },
    description: {
      fa: "آرایش روزانه، مجلسی و عروس",
      en: "Everyday, evening and bridal makeup",
    },
  },
  {
    category_id: "brows_lashes",
    name: { fa: "ابرو و مژه", en: "Brows & Lashes" },
    description: {
      fa: "طراحی ابرو، لمینت و خدمات مژه",
      en: "Brow design, lamination and lash services",
    },
  },
  {
    category_id: "nails",
    name: { fa: "ناخن", en: "Nails" },
    description: {
      fa: "مانیکور، پدیکور و کاشت ژل",
      en: "Manicure, pedicure and gel nails",
    },
  },
  {
    category_id: "skin",
    name: { fa: "پوست", en: "Skin" },
    description: {
      fa: "فیشیال و مراقبت‌های تخصصی پوست",
      en: "Facials and professional skin care",
    },
  },
];

export const SERVICES: Service[] = [
  {
    service_id: "haircut",
    name: { fa: "کوتاهی مو", en: "Haircut" },
    description: {
      fa: "کوتاهی تخصصی متناسب با فرم صورت و جنس مو.",
      en: "A precision cut shaped to your face and hair texture.",
    },
    price: 1200000,
    currency: "IRR",
    duration_minutes: 45,
    category: "hair",
  },
  {
    service_id: "hair_color",
    name: { fa: "رنگ مو", en: "Hair Color" },
    description: {
      fa: "رنگ‌آمیزی کامل با رنگ‌های حرفه‌ای و مراقبت پس از رنگ.",
      en: "Full-length colour with professional products and aftercare.",
    },
    price: 3500000,
    currency: "IRR",
    duration_minutes: 120,
    category: "hair",
    featured: true,
  },
  {
    service_id: "highlights",
    name: { fa: "هایلایت", en: "Highlights" },
    description: {
      fa: "هایلایت روشن‌کننده برای حجم و درخشش بیشتر مو.",
      en: "Brightening highlights for extra depth and shine.",
    },
    price: 4200000,
    currency: "IRR",
    duration_minutes: 150,
    category: "hair",
  },
  {
    service_id: "balayage",
    name: { fa: "بالیاژ", en: "Balayage" },
    description: {
      fa: "سایه‌روشن دست‌ساز با رشد طبیعی و ظاهری نرم.",
      en: "Hand-painted, soft-growing colour with a natural finish.",
    },
    price: 5800000,
    currency: "IRR",
    duration_minutes: 180,
    category: "hair",
    featured: true,
  },
  {
    service_id: "blow_dry",
    name: { fa: "براشینگ", en: "Blow Dry" },
    description: {
      fa: "حالت‌دهی و براشینگ حرفه‌ای برای ظاهری صاف و درخشان.",
      en: "Professional styling for a smooth, glossy finish.",
    },
    price: 900000,
    currency: "IRR",
    duration_minutes: 40,
    category: "hair",
  },
  {
    service_id: "hair_treatment",
    name: { fa: "تراپی مو", en: "Hair Treatment" },
    description: {
      fa: "ترمیم عمقی برای موهای آسیب‌دیده و خشک.",
      en: "Deep repair for dry or damaged hair.",
    },
    price: 2400000,
    currency: "IRR",
    duration_minutes: 60,
    category: "hair",
  },
  {
    service_id: "keratin",
    name: { fa: "کراتینه", en: "Keratin" },
    description: {
      fa: "صاف و نرم‌کردن بلندمدت مو با کراتین.",
      en: "Long-lasting smoothing and frizz control with keratin.",
    },
    price: 7500000,
    currency: "IRR",
    duration_minutes: 210,
    category: "hair",
  },
  {
    service_id: "makeup",
    name: { fa: "میکاپ", en: "Makeup" },
    description: {
      fa: "آرایش روشن و طبیعی برای روز.",
      en: "Fresh, natural makeup for daytime.",
    },
    price: 2200000,
    currency: "IRR",
    duration_minutes: 60,
    category: "makeup",
  },
  {
    service_id: "bridal_makeup",
    name: { fa: "میکاپ عروس", en: "Bridal Makeup" },
    description: {
      fa: "پکیج کامل عروس شامل تست آرایش و شینیون.",
      en: "Complete bridal package including a trial and hair styling.",
    },
    price: 12000000,
    currency: "IRR",
    duration_minutes: 240,
    category: "makeup",
    featured: true,
  },
  {
    service_id: "evening_makeup",
    name: { fa: "میکاپ مجلسی", en: "Evening Makeup" },
    description: {
      fa: "آرایش مجلسی ماندگار برای مهمانی و مراسم.",
      en: "Long-wear glam for parties and events.",
    },
    price: 3200000,
    currency: "IRR",
    duration_minutes: 90,
    category: "makeup",
  },
  {
    service_id: "eyebrow_styling",
    name: { fa: "طراحی ابرو", en: "Eyebrow Styling" },
    description: {
      fa: "اصلاح و فرم‌دهی ابرو متناسب با چهره.",
      en: "Shaping and tidying tailored to your features.",
    },
    price: 550000,
    currency: "IRR",
    duration_minutes: 25,
    category: "brows_lashes",
  },
  {
    service_id: "eyebrow_lamination",
    name: { fa: "لمینت ابرو", en: "Eyebrow Lamination" },
    description: {
      fa: "حالت‌دهی ماندگار ابرو برای ظاهری پرپشت و مرتب.",
      en: "Lasting brow lift for a fuller, groomed look.",
    },
    price: 1500000,
    currency: "IRR",
    duration_minutes: 50,
    category: "brows_lashes",
  },
  {
    service_id: "lash_lift",
    name: { fa: "لیفت مژه", en: "Lash Lift" },
    description: {
      fa: "فر و بالاآوردن مژه‌های طبیعی بدون اکستنشن.",
      en: "Curling and lifting your natural lashes, no extensions.",
    },
    price: 1800000,
    currency: "IRR",
    duration_minutes: 60,
    category: "brows_lashes",
  },
  {
    service_id: "eyelash_extensions",
    name: { fa: "اکستنشن مژه", en: "Eyelash Extensions" },
    description: {
      fa: "کاشت مژه تک‌به‌تک با حجم دلخواه.",
      en: "Individual lash application in your preferred volume.",
    },
    price: 2800000,
    currency: "IRR",
    duration_minutes: 120,
    category: "brows_lashes",
  },
  {
    service_id: "manicure",
    name: { fa: "مانیکور", en: "Manicure" },
    description: {
      fa: "مراقبت کامل دست و ناخن با لاک دلخواه.",
      en: "Complete hand and nail care with the polish of your choice.",
    },
    price: 1100000,
    currency: "IRR",
    duration_minutes: 50,
    category: "nails",
  },
  {
    service_id: "pedicure",
    name: { fa: "پدیکور", en: "Pedicure" },
    description: {
      fa: "مراقبت و لطافت پا همراه با ماساژ کوتاه.",
      en: "Softening foot care with a short massage.",
    },
    price: 1400000,
    currency: "IRR",
    duration_minutes: 60,
    category: "nails",
  },
  {
    service_id: "gel_nails",
    name: { fa: "کاشت ژل", en: "Gel Nails" },
    description: {
      fa: "کاشت و فرم‌دهی ژل با ماندگاری بالا.",
      en: "Durable gel extensions shaped to your preference.",
    },
    price: 2600000,
    currency: "IRR",
    duration_minutes: 100,
    category: "nails",
    featured: true,
  },
  {
    service_id: "facial",
    name: { fa: "فیشیال", en: "Facial" },
    description: {
      fa: "پاک‌سازی و آبرسانی پوست با محصولات حرفه‌ای.",
      en: "Cleansing and hydrating facial with professional products.",
    },
    price: 2500000,
    currency: "IRR",
    duration_minutes: 75,
    category: "skin",
  },
  {
    service_id: "skin_care",
    name: { fa: "مراقبت پوست", en: "Skin Care" },
    description: {
      fa: "برنامه مراقبتی اختصاصی بر اساس نوع پوست شما.",
      en: "A tailored care routine based on your skin type.",
    },
    price: 1900000,
    currency: "IRR",
    duration_minutes: 45,
    category: "skin",
  },
  {
    service_id: "deep_cleansing",
    name: { fa: "پاک‌سازی عمیق", en: "Deep Cleansing" },
    description: {
      fa: "پاک‌سازی تخصصی منافذ و تعادل‌بخشی پوست.",
      en: "Targeted pore cleansing and rebalancing.",
    },
    price: 2100000,
    currency: "IRR",
    duration_minutes: 70,
    category: "skin",
  },
];

export const getServiceById = (serviceId: string): Service | undefined =>
  SERVICES.find((service) => service.service_id === serviceId);
