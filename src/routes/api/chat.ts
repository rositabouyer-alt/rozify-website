import { createFileRoute } from "@tanstack/react-router";
import type { ChatRequest } from "@/types";

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

/** POST /api/chat — provider selection happens server-side only. */
export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: Partial<ChatRequest>;
        try {
          body = (await request.json()) as Partial<ChatRequest>;
        } catch {
          return json({ error: "invalid_booking" }, 400);
        }

        const message = (body.message ?? "").toString().trim();
        const language = body.language === "en" ? "en" : "fa";
        const conversationId = (body.conversation_id ?? "CV-UNKNOWN").toString();

        if (!message) return json({ error: "empty_message" }, 400);

        try {
          const { runAssistant } = await import("@/lib/ai/providers.server");
          const result = await runAssistant({ message, language, history: [] });
          const { notifyChatMessage } = await import("@/lib/crm/crm.server");
          await notifyChatMessage({
            conversationId,
            customerId: typeof body.customer_id === "string" ? body.customer_id : null,
            language,
            userMessage: message,
            assistantMessage: result.message,
            provider: result.provider,
            actions: result.actions,
          }).catch(() => null);
          return json({
            message: result.message,
            provider: result.provider,
            conversation_id: conversationId,
            actions: result.actions,
          });
        } catch {
          return json({ error: "ai_unavailable" }, 503);
        }
      },
    },
  },
});
