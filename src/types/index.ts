/**
 * Shared domain types. These mirror the shapes the real backend / CRM
 * will return, so the mock layer can be swapped without touching the UI.
 */

export type Language = "fa" | "en";

export type Localized = Record<Language, string>;

export type ServiceCategoryId =
    | "hair"
    | "makeup"
    | "brows_lashes"
    | "nails"
    | "skin";

export interface ServiceCategory {
  category_id: ServiceCategoryId;
  name: Localized;
  description: Localized;
}

export interface Service {
  service_id: string;
  name: Localized;
  description: Localized;
  /** Stored in the smallest displayed unit of the currency (IRR). */
  price: number;
  currency: "IRR";
  duration_minutes: number;
  category: ServiceCategoryId;
  featured?: boolean;
}

export interface Customer {
  customer_id: string | null;
  name: string;
  phone: string;
  notes?: string | undefined;
}

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";

export interface Booking {
  booking_id: string;
  customer_id: string | null;
  service_id: string;
  customer_name: string;
  phone: string;
  /** ISO date, e.g. 2026-09-21 */
  date: string;
  /** 24h time, e.g. "14:30" */
  time: string;
  duration_minutes: number;
  status: BookingStatus;
  created_at: string;
  notes?: string | undefined;
}

export interface BookingRequest {
  service_id: string;
  customer_name: string;
  phone: string;
  date: string;
  time: string;
  customer_id?: string | null;
  notes?: string | undefined;
  language: Language;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Availability {
  date: string;
  service_id: string;
  slots: TimeSlot[];
}

export type ChatRole = "user" | "assistant";

export interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

export interface Message {
  message_id: string;
  conversation_id: string;
  role: ChatRole;
  content: string;
  created_at: string;
}

export interface Conversation {
  conversation_id: string;
  customer_id: string | null;
  language: Language;
}

export type AIProviderName = "demo" | "ollama" | "gapgpt";

export interface ChatRequest {
  message: string;
  language: Language;
  conversation_id: string;
  customer_id?: string | null;
  history?: AIMessage[];
}

export interface ChatAction {
  type: "open_booking" | "select_service" | "show_contact";
  service_id?: string;
}

export interface ChatResponse {
  message: string;
  provider: AIProviderName;
  conversation_id: string;
  actions: ChatAction[];
}

/** Uniform error surface — never leak technical detail to the UI. */
export type ApiErrorCode =
  | "network"
  | "timeout"
  | "ai_unavailable"
  | "backend_unavailable"
  | "slot_unavailable"
  | "invalid_phone"
  | "invalid_booking"
  | "empty_message"
  | "not_found"
  | "unknown";

export class ApiError extends Error {
  code: ApiErrorCode;

  constructor(code: ApiErrorCode, message?: string) {
    super(message ?? code);
    this.name = "ApiError";
    this.code = code;
  }
}

