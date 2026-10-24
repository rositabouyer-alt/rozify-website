import { describe, expect, it, vi } from "vitest";
import {
  DEFAULT_INGEST_PATH,
  notifyBookingCreated,
  notifyChatMessage,
  notifyCustomerUpdated,
  readCrmConfig,
  sendCrmEvent,
} from "./crm.server";
import { buildEvent, normalizePhone } from "./events";
import type { Booking } from "@/types";

const env = { CRM_API_URL: "https://crm.test/", WEBSITE_INGEST_TOKEN: "test-token" };

const booking: Booking = {
  booking_id: "BK-20260923-001",
  customer_id: "CU-DEMO-0001",
  service_id: "hair_color",
  customer_name: "Sara",
  phone: "0912 123 4567",
  date: "2026-09-23",
  time: "10:30",
  duration_minutes: 120,
  status: "confirmed",
  created_at: "2026-09-23T08:00:00.000Z",
};

function mockCrm(status = 202) {
  const calls: { url: string; init: RequestInit; body: any }[] = [];
  const fetchImpl = vi.fn(async (url: any, init: any) => {
    calls.push({ url: String(url), init, body: JSON.parse(init.body) });
    return new Response(JSON.stringify({ ok: status < 400 }), { status });
  }) as unknown as typeof fetch;
  return { calls, fetchImpl };
}

describe("CRM config", () => {
  it("is disabled when URL or token missing", () => {
    expect(readCrmConfig({})).toBeNull();
    expect(readCrmConfig({ CRM_API_URL: "https://x" })).toBeNull();
    expect(readCrmConfig({ WEBSITE_INGEST_TOKEN: "t" })).toBeNull();
  });
  it("builds the endpoint URL", () => {
    expect(readCrmConfig(env)?.url).toBe(`https://crm.test${DEFAULT_INGEST_PATH}`);
    expect(readCrmConfig({ ...env, CRM_INGEST_PATH: "hooks/site" })?.url).toBe(
      "https://crm.test/hooks/site",
    );
  });
});

describe("sendCrmEvent", () => {
  it("skips without calling fetch when not configured", async () => {
    const { fetchImpl } = mockCrm();
    const result = await sendCrmEvent(buildEvent("chat.message", {} as any), {
      env: {},
      fetchImpl,
    });
    expect(result).toEqual({ status: "skipped", reason: "not_configured" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("sends bearer token, event headers and envelope", async () => {
    const { calls, fetchImpl } = mockCrm();
    const event = buildEvent("customer.created", {
      customer_id: null,
      name: "A",
      phone: "+989121234567",
      language: "fa",
    });
    const result = await sendCrmEvent(event, { env, fetchImpl });
    expect(result).toEqual({ status: "sent", httpStatus: 202 });
    const headers = calls[0]!.init.headers as Record<string, string>;
    expect(headers["Authorization"]).toBe("Bearer test-token");
    expect(headers["X-Rozify-Event"]).toBe("customer.created");
    expect(headers["Idempotency-Key"]).toBe(event.event_id);
    expect(calls[0]!.body).toMatchObject({
      event_type: "customer.created",
      source: "rozify-website",
      schema_version: 1,
    });
  });

  it("never throws on HTTP errors or network failures", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { fetchImpl } = mockCrm(500);
    const ev = buildEvent("chat.message", {} as any);
    expect(await sendCrmEvent(ev, { env, fetchImpl })).toEqual({
      status: "failed",
      reason: "http_500",
    });
    const broken = (async () => {
      throw new TypeError("down");
    }) as unknown as typeof fetch;
    expect(await sendCrmEvent(ev, { env, fetchImpl: broken })).toEqual({
      status: "failed",
      reason: "network_error",
    });
  });
});

describe("event helpers", () => {
  it("booking sends customer.created then booking.created with service data", async () => {
    const { calls, fetchImpl } = mockCrm();
    const results = await notifyBookingCreated(booking, "en", { env, fetchImpl });
    expect(results.map((r) => r.status)).toEqual(["sent", "sent"]);
    expect(calls.map((c) => c.body.event_type)).toEqual(["customer.created", "booking.created"]);
    const data = calls[1]!.body.data;
    expect(data).toMatchObject({
      booking_id: "BK-20260923-001",
      phone: "+989121234567",
      currency: "IRR",
      language: "en",
    });
    expect(data.service_name?.en).toBeTruthy();
    expect(typeof data.price).toBe("number");
  });

  it("customer.updated and chat.message payloads", async () => {
    const { calls, fetchImpl } = mockCrm();
    await notifyCustomerUpdated({ ...booking, customer_name: "Sara K" }, "fa", { env, fetchImpl });
    await notifyChatMessage(
      {
        conversationId: "CV-1",
        customerId: null,
        language: "en",
        userMessage: "Hi",
        assistantMessage: "Hello",
        provider: "demo",
        actions: [{ type: "select_service", service_id: "hair_color" }],
      },
      { env, fetchImpl },
    );
    expect(calls[0]!.body).toMatchObject({
      event_type: "customer.updated",
      data: { name: "Sara K" },
    });
    expect(calls[1]!.body).toMatchObject({
      event_type: "chat.message",
      data: { conversation_id: "CV-1", user_message: "Hi", assistant_message: "Hello" },
    });
  });

  it("normalises Iranian phone numbers incl. Persian digits", () => {
    expect(normalizePhone("۰۹۱۲۱۲۳۴۵۶۷")).toBe("+989121234567");
    expect(normalizePhone("+98 912 123 4567")).toBe("+989121234567");
  });
});
