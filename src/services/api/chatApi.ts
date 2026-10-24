import type { ChatRequest, ChatResponse } from "@/types";
import { ApiError } from "@/types";
import { apiRequest } from "./http";

/**
 * The chatbot never talks to an AI provider directly — it always calls our own
 * /api/chat endpoint, which selects the provider server-side (demo / Ollama /
 * GapGPT). No API keys ever reach the browser.
 */
export const chatApi = {
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    if (!request.message.trim()) throw new ApiError("empty_message");
    return apiRequest<ChatResponse>("/api/chat", {
      method: "POST",
      body: JSON.stringify(request),
    });
  },
};

export const createConversationId = (): string =>
  `CV-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
