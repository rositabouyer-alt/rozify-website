import { createFileRoute } from "@tanstack/react-router";
import { cancelMockBooking, getMockBooking, updateMockBooking } from "@/services/mock/mockBackend";
import { ApiError, type Booking } from "@/types";

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

const handle = (action: () => Booking) => {
  try {
    return json(action());
  } catch (error) {
    const code = error instanceof ApiError ? error.code : "backend_unavailable";
    return json({ error: code }, code === "not_found" ? 404 : 500);
  }
};

/** GET / PATCH / DELETE /api/bookings/:id */
export const Route = createFileRoute("/api/bookings/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => handle(() => getMockBooking(params.id)),
      PATCH: async ({ request, params }) => {
        const patch = (await request.json().catch(() => ({}))) as Partial<Booking>;
        const response = handle(() => updateMockBooking(params.id, patch));
        if (response.ok && (patch.customer_name || patch.phone || patch.notes !== undefined)) {
          const { notifyCustomerUpdated } = await import("@/lib/crm/crm.server");
          const lang = new URL(request.url).searchParams.get("lang") === "en" ? "en" : "fa";
          await notifyCustomerUpdated(getMockBooking(params.id), lang).catch(() => null);
        }
        return response;
      },
      DELETE: async ({ params }) => handle(() => cancelMockBooking(params.id)),
    },
  },
});
