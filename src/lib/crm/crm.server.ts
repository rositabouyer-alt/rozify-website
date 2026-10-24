/**
 * Server-only CRM client. Never import this from browser code — the
 * `.server.ts` suffix blocks it from client bundles.
 *
 * Configuration (read per call, never at module scope):
 *   CRM_API_URL           Base URL of your CRM, e.g. https://crm.example.com
 *   WEBSITE_INGEST_TOKEN  Shared token, sent as `Authorization: Bearer <token>`
 *   CRM_INGEST_PATH       Optional, defaults to /api/ingest/website
 *
 * If CRM_API_URL or the token is missing, events are skipped silently.
 * Delivery errors are logged and swallowed: the CRM can never break booking or chat.
 */
import { getServiceById } from "@/data/services";
import type { Booking, ChatAction, Language } from "@/types";
import {
  buildEvent,
  normalizePhone,
  type CrmEvent,
  type CrmEventDataMap,
  type CrmEventType,
} from "./events";

export const DEFAULT_INGEST_PATH = "/api/ingest/website";
const TIMEOUT_MS = 5000;

export type CrmDeliveryResult =
  | { status: "sent"; httpStatus: number }
  | { status: "skipped"; reason: "not_configured" }
  | { status: "failed"; reason: string };

interface CrmConfig {
  url: string;
  token: string;
}

export function readCrmConfig(
  env: Record<string, string | undefined> = process.env,
): CrmConfig | null {
  const base = (env["CRM_API_URL"] ?? "").trim().replace(/\/+$/, "");
  const token = (env["WEBSITE_INGEST_TOKEN"] ?? "").trim();
  if (!base || !token) return null;
  const rawPath = (env["CRM_INGEST_PATH"] ?? "").trim() || DEFAULT_INGEST_PATH;
  const path = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
  return { url: `${base}${path}`, token };
}

export async function sendCrmEvent(
  event: CrmEvent,
  options: { env?: Record<string, string | undefined>; fetchImpl?: typeof fetch } = {},
): Promise<CrmDeliveryResult> {
  const config = readCrmConfig(options.env);
  if (!config) return { status: "skipped", reason: "not_configured" };
  const doFetch = options.fetchImpl ?? fetch;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await doFetch(config.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.token}`,
        "X-Rozify-Event": event.event_type,
        "Idempotency-Key": event.event_id,
      },
      body: JSON.stringify(event),
      signal: controller.signal,
    });
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error(`[crm] ${event.event_type} failed [${response.status}]: ${body.slice(0, 300)}`);
      return { status: "failed", reason: `http_${response.status}` };
    }
    return { status: "sent", httpStatus: response.status };
  } catch (error) {
    const reason =
      error instanceof Error && error.name === "AbortError" ? "timeout" : "network_error";
    console.error(`[crm] ${event.event_type} ${reason}`);
    return { status: "failed", reason };
  } finally {
    clearTimeout(timer);
  }
}

export function emit<T extends CrmEventType>(
  type: T,
  data: CrmEventDataMap[T],
  options?: Parameters<typeof sendCrmEvent>[1],
) {
  return sendCrmEvent(buildEvent(type, data), options);
}

/** Booking confirmed → sends customer.created then booking.created. */
export async function notifyBookingCreated(
  booking: Booking,
  language: Language,
  options?: Parameters<typeof sendCrmEvent>[1],
): Promise<CrmDeliveryResult[]> {
  const service = getServiceById(booking.service_id);
  const phone = normalizePhone(booking.phone);
  const customer = await emit(
    "customer.created",
    {
      customer_id: booking.customer_id,
      name: booking.customer_name,
      phone,
      language,
      notes: booking.notes,
    },
    options,
  );
  const created = await emit(
    "booking.created",
    {
      booking_id: booking.booking_id,
      customer_id: booking.customer_id,
      customer_name: booking.customer_name,
      phone,
      service_id: booking.service_id,
      service_name: service ? { fa: service.name.fa, en: service.name.en } : null,
      price: service?.price ?? null,
      currency: "IRR",
      date: booking.date,
      time: booking.time,
      duration_minutes: booking.duration_minutes,
      status: booking.status,
      notes: booking.notes,
      language,
      created_at: booking.created_at,
    },
    options,
  );
  return [customer, created];
}

/** Customer name/phone/notes changed on an existing booking. */
export function notifyCustomerUpdated(
  booking: Booking,
  language: Language,
  options?: Parameters<typeof sendCrmEvent>[1],
) {
  return emit(
    "customer.updated",
    {
      customer_id: booking.customer_id,
      name: booking.customer_name,
      phone: normalizePhone(booking.phone),
      language,
      notes: booking.notes,
    },
    options,
  );
}

export function notifyChatMessage(
  input: {
    conversationId: string;
    customerId: string | null;
    language: Language;
    userMessage: string;
    assistantMessage: string;
    provider: string;
    actions: ChatAction[];
  },
  options?: Parameters<typeof sendCrmEvent>[1],
) {
  return emit(
    "chat.message",
    {
      conversation_id: input.conversationId,
      customer_id: input.customerId,
      language: input.language,
      user_message: input.userMessage,
      assistant_message: input.assistantMessage,
      ai_provider: input.provider,
      actions: input.actions.map((a) => ({ type: a.type, service_id: a.service_id })),
    },
    options,
  );
}
