"use client";

import { useMutation } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import { dictionaries, type Lang } from "@/i18n/dictionary";
import { useLanguage } from "@/i18n/language";
import { askAI, chatEndpoint, detectLang, findAnswer, type Answer } from "@/lib/assistant";

export type ChatMsg = Answer & { id: number; role: "user" | "assistant"; pending?: boolean };

type Turn = { role: "user" | "assistant"; text: string };

/**
 * Shared "Maha" conversation logic for the floating widget and the chat-style home page.
 * 1. Built-in bilingual answers  2. AI (when NEXT_PUBLIC_CHAT_API is set)  3. WhatsApp fallback.
 */
export function useMahaChat() {
  const { lang } = useLanguage();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const idRef = useRef(1);

  const ai = useMutation({
    mutationFn: (v: { message: string; lang: Lang; history: Turn[] }) => askAI(v.message, v.lang, v.history),
  });

  const settle = (id: number, patch: Partial<ChatMsg>) =>
    setMessages((m) => m.map((x) => (x.id === id ? { ...x, ...patch, pending: false } : x)));

  const busy = ai.isPending || messages.some((m) => m.pending);

  const ask = useCallback(
    async (raw: string) => {
      const question = raw.trim().slice(0, 500);
      if (!question || busy) return;
      const qLang = detectLang(question, lang);
      const history: Turn[] = messages.filter((m) => !m.pending).map(({ role, text }) => ({ role, text }));
      const userId = idRef.current;
      const botId = userId + 1;
      idRef.current += 2;
      setMessages((m) => [
        ...m,
        { id: userId, role: "user", text: question },
        { id: botId, role: "assistant", text: "", pending: true },
      ]);

      const fallback: Answer = { text: dictionaries[qLang].chat.fallback, whatsapp: true, register: true };
      const known = findAnswer(question, qLang);
      if (known || !chatEndpoint) {
        await new Promise((r) => setTimeout(r, 450));
        settle(botId, known ?? fallback);
        return;
      }
      try {
        const text = await ai.mutateAsync({ message: question, lang: qLang, history });
        settle(botId, { text, whatsapp: true });
      } catch {
        settle(botId, fallback);
      }
    },
    [ai, busy, lang, messages],
  );

  const reset = useCallback(() => {
    setMessages([]);
    ai.reset();
    idRef.current = 1;
  }, [ai]);

  return { messages, ask, reset, busy };
}
