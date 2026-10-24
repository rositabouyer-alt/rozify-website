import type { AIProviderName, ChatAction, Language } from "@/types";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIResult {
  message: string;
  actions: ChatAction[];
}

export interface AIProvider {
  name: AIProviderName;
  chat(input: { message: string; language: Language; history: AIMessage[] }): Promise<AIResult>;
}
