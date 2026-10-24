/**
 * Website → CRM event contracts.
 *
 * These are the only shapes the website ever sends to the CRM. They are plain
 * JSON and safe to share between projects. Map them to your CRM models.
 * This file holds types and pure helpers only — no secrets, no network code.
 */
import type { Booking, Language } from "@/types";

export const CRM_SOURCE = "rozify-website" as const;
export const CRM_SCHEMA_VERSION = 1 as const;

export type CrmEventType =
  "booking.created" | "customer.created" | "customer.updated" | "chat.message";

export interface CrmCustomerPayload {
  customer_id: string | null;
  name: string;
  /** Normalised to +98XXXXXXXXXX when it is an Iranian mobile number. */
  phone: string;
  language: Language;
  notes?: string | undefined;
}

export interface CrmBookingPayload {
  booking_id: string;
  customer_id: string | null;
  customer_name: string;
  phone: string;
  service_id: string;
  service_name: { fa: string; en: string } | null;
  price: number | null;
  currency: "IRR";
  date: string;
  time: string;
  duration_minutes: number;
  status: Booking["status"];
  notes?: string | undefined;
  language: Language;
  created_at: string;
}

export interface CrmChatMessagePayload {
  conversation_id: string;
  customer_id: string | null;
  language: Language;
  user_message: string;
  assistant_message: string;
  ai_provider: string;
  actions: { type: string; service_id?: string | undefined }[];
}

export interface CrmEventDataMap {
  "booking.created": CrmBookingPayload;
  "customer.created": CrmCustomerPayload;
  "customer.updated": CrmCustomerPayload;
  "chat.message": CrmChatMessagePayload;
}

export interface CrmEvent<T extends CrmEventType = CrmEventType> {
  event_id: string;
  event_type: T;
  schema_version: typeof CRM_SCHEMA_VERSION;
  source: typeof CRM_SOURCE;
  occurred_at: string;
  data: CrmEventDataMap[T];
}

export function normalizePhone(phone: string): string {
  const digits = phone
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[^\d+]/g, "");
  if (/^09\d{9}$/.test(digits)) return `+98${digits.slice(1)}`;
  if (/^0098\d{10}$/.test(digits)) return `+${digits.slice(2)}`;
  if (/^98\d{10}$/.test(digits)) return `+${digits}`;
  return digits;
}

export function buildEvent<T extends CrmEventType>(
  type: T,
  data: CrmEventDataMap[T],
  now: Date = new Date(),
): CrmEvent<T> {
  return {
    event_id: crypto.randomUUID(),
    event_type: type,
    schema_version: CRM_SCHEMA_VERSION,
    source: CRM_SOURCE,
    occurred_at: now.toISOString(),
    data,
  };
}
