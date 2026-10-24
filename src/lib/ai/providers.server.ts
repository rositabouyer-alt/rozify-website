import type { AIProvider, AIMessage } from "./types";
import { buildSystemPrompt } from "./knowledge";
import { demoProvider } from "./demoProvider";

/**
 * Server-only AI providers. Credentials are read inside the request handler
 * and never leave the server.
 */

const REQUEST_TIMEOUT_MS = 20000;

async function postJson(url: string, body: unknown, headers: Record<string, string>) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`provider_http_${response.status}`);
    return (await response.json()) as Record<string, any>;
  } finally {
    clearTimeout(timer);
  }
}

export const ollamaProvider: AIProvider = {
  name: "ollama",
  async chat({ message, language, history }) {
    const baseUrl = process.env["OLLAMA_BASE_URL"] ?? "http://localhost:11434";
    const model = process.env["OLLAMA_MODEL"] ?? "llama3.1";
    const messages: AIMessage[] = [
      { role: "system", content: buildSystemPrompt(language) },
      ...history,
      { role: "user", content: message },
    ];
    const data = await postJson(`${baseUrl}/api/chat`, { model, messages, stream: false }, {});
    return { message: String(data?.["message"]?.["content"] ?? "").trim(), actions: [] };
  },
};

export const gapgptProvider: AIProvider = {
  name: "gapgpt",
  async chat({ message, language, history }) {
    const apiKey = process.env["GAPGPT_API_KEY"];
    if (!apiKey) throw new Error("missing_gapgpt_key");
    const baseUrl = process.env["GAPGPT_BASE_URL"] ?? "https://api.gapgpt.app/v1";
    const model = process.env["GAPGPT_MODEL"] ?? "gpt-4o-mini";
    const messages: AIMessage[] = [
      { role: "system", content: buildSystemPrompt(language) },
      ...history,
      { role: "user", content: message },
    ];
    const data = await postJson(
      `${baseUrl}/chat/completions`,
      { model, messages, temperature: 0.3 },
      { Authorization: `Bearer ${apiKey}` },
    );
    return {
      message: String(data?.["choices"]?.[0]?.["message"]?.["content"] ?? "").trim(),
      actions: [],
    };
  },
};

export function resolveProvider(): AIProvider {
  switch (process.env["AI_PROVIDER"]) {
    case "ollama":
      return ollamaProvider;
    case "gapgpt":
      return gapgptProvider;
    default:
      return demoProvider;
  }
}

/** Runs the configured provider, falling back to the local demo assistant. */
export async function runAssistant(input: Parameters<AIProvider["chat"]>[0]) {
  const provider = resolveProvider();
  try {
    const result = await provider.chat(input);
    if (!result.message) throw new Error("empty_provider_response");
    return { ...result, provider: provider.name };
  } catch {
    const fallback = await demoProvider.chat(input);
    return { ...fallback, provider: demoProvider.name };
  }
}
