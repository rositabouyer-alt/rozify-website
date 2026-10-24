import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useLanguage } from "@/i18n/LanguageProvider";
import { chatApi, createConversationId } from "@/services/api/chatApi";
import {
  ApiError,
  type AIMessage,
  type ChatAction,
  type ChatRole,
} from "@/types";
import { cn } from "@/lib/utils";

interface Bubble {
  id: string;
  role: ChatRole;
  content: string;
  actions?: ChatAction[];
}

export function ChatWidget() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Bubble[]>([]);

  const conversationId = useRef(createConversationId());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: "greeting",
        role: "assistant",
        content: t.chat.greeting,
      },
    ]);
  }, [t.chat.greeting]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open]);

  const send = async (raw: string) => {
    const message = raw.trim();

    if (!message || sending) return;

    setInput("");

    const userBubble: Bubble = {
      id: `u-${Date.now()}`,
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, userBubble]);
    setSending(true);

    try {
      /*
       * Send the previous conversation to the AI so the assistant
       * can understand context and continue the conversation naturally.
       *
       * The current message is intentionally excluded because it is
       * sent separately as `message`.
       */
      const history: AIMessage[] = messages
        .filter(
          (item) =>
            item.role === "user" || item.role === "assistant",
        )
        .map((item) => ({
          role: item.role,
          content: item.content,
        }));

      const response = await chatApi.sendMessage({
        message,
        language,
        conversation_id: conversationId.current,
        history,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: response.message,
          actions: response.actions,
        },
      ]);
    } catch (error) {
      const code =
        error instanceof ApiError ? error.code : "unknown";

      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: "assistant",
          content: t.errors[code] ?? t.errors.unknown,
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const runAction = (action: ChatAction) => {
    if (action.type === "show_contact") {
      void navigate({ to: "/contact" });
      return;
    }

    void navigate({
      to: "/booking",
      search: action.service_id
        ? { service: action.service_id }
        : {},
    });

    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? t.chat.close : t.chat.open}
        className="fixed bottom-5 end-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lift transition-transform duration-300 hover:scale-105"
      >
        <span
          aria-hidden
          className="font-display text-lg tracking-widest"
        >
          {open ? "×" : "AI"}
        </span>
      </button>

      {open && (
        <div className="fixed bottom-24 end-5 z-50 flex h-[30rem] w-[min(22rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-lift animate-[var(--animate-fade-up)]">
          <header className="border-b border-border bg-muted/60 px-5 py-4">
            <p className="font-display text-xl">
              {t.chat.title}
            </p>

            <p className="text-xs text-muted-foreground">
              {t.chat.subtitle}
            </p>
          </header>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >
            {messages.map((bubble) => (
              <div key={bubble.id}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    bubble.role === "user"
                      ? "ms-auto bg-primary text-primary-foreground"
                      : "bg-muted text-foreground",
                  )}
                >
                  {bubble.content}
                </div>

                {bubble.actions &&
                  bubble.actions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {bubble.actions.map(
                        (action, index) => (
                          <button
                            key={`${bubble.id}-${index}`}
                            type="button"
                            onClick={() =>
                              runAction(action)
                            }
                            className="rounded-full border border-primary/40 px-3 py-1 text-xs text-primary transition-colors hover:bg-primary/10"
                          >
                            {action.type ===
                            "show_contact"
                              ? t.contact.title
                              : t.chat.goToBooking}
                          </button>
                        ),
                      )}
                    </div>
                  )}
              </div>
            ))}

            {sending && (
              <p className="text-xs text-muted-foreground">
                {t.chat.typing}
              </p>
            )}

            {messages.length <= 1 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {t.chat.suggestions.map(
                  (suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() =>
                        void send(suggestion)
                      }
                      className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {suggestion}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>

          <form
            className="flex items-center gap-2 border-t border-border p-3"
            onSubmit={(event) => {
              event.preventDefault();
              void send(input);
            }}
          >
            <input
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              placeholder={t.chat.placeholder}
              className="h-10 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary"
            />

            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="h-10 rounded-full bg-primary px-4 text-sm text-primary-foreground disabled:opacity-50"
            >
              {t.chat.send}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
