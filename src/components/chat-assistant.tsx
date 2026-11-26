"use client";

import { useMutation } from "@tanstack/react-query";
import { Bot, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { dictionaries } from "@/i18n/dictionary";
import { useLanguage } from "@/i18n/language";
import { askAI, chatEndpoint, detectLang, findAnswer } from "@/lib/assistant";
import { whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "./brand-icons";

type Msg = { id: number; role: "user" | "assistant"; text: string; whatsapp?: boolean; pending?: boolean };

export function ChatAssistant() {
  const { lang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const idRef = useRef(1);

  const ai = useMutation({
    mutationFn: (v: { message: string; lang: typeof lang; history: { role: "user" | "assistant"; text: string }[] }) =>
      askAI(v.message, v.lang, v.history),
  });

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const [nudge, setNudge] = useState(false);

  // Friendly "Hi, I'm Maha" bubble a few seconds after load (once per visit)
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("dswm-nudge") === "1";
    } catch {}
    if (seen) return;
    const id = window.setTimeout(() => setNudge(true), 4000);
    return () => window.clearTimeout(id);
  }, []);

  const hideNudge = () => {
    setNudge(false);
    try {
      sessionStorage.setItem("dswm-nudge", "1");
    } catch {}
  };

  const openChat = () => {
    hideNudge();
    setOpen(true);
  };

  /** Closing ends the conversation: messages, input and any pending request are cleared. */
  const close = () => {
    setOpen(false);
    setMessages([]);
    setInput("");
    ai.reset();
    idRef.current = 1;
    requestAnimationFrame(() => launcherRef.current?.focus());
  };

  const reply = (id: number, patch: Partial<Msg>) =>
    setMessages((m) => m.map((x) => (x.id === id ? { ...x, ...patch, pending: false } : x)));

  const ask = async (raw: string) => {
    const question = raw.trim().slice(0, 500);
    if (!question || ai.isPending) return;
    const qLang = detectLang(question, lang);
    const history = messages.filter((m) => !m.pending).map(({ role, text }) => ({ role, text }));
    const userId = idRef.current;
    const botId = userId + 1;
    idRef.current += 2;
    setMessages((m) => [...m, { id: userId, role: "user", text: question }, { id: botId, role: "assistant", text: "", pending: true }]);
    setInput("");

    // Answer in the language the visitor typed in
    const fallback = { text: dictionaries[qLang].chat.fallback, whatsapp: true };
    const known = findAnswer(question, qLang);
    if (known || !chatEndpoint) {
      await new Promise((r) => setTimeout(r, 450));
      reply(botId, known ?? fallback);
      return;
    }
    try {
      const text = await ai.mutateAsync({ message: question, lang: qLang, history });
      reply(botId, { text, whatsapp: true });
    } catch {
      reply(botId, fallback);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void ask(input);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") close();
  };

  return (
    <>
      {/* Launcher — always present while the chat is closed */}
      <div className={`fixed bottom-5 left-5 z-[55] ${open ? "pointer-events-none invisible" : ""}`}>
        <AnimatePresence>
          {nudge && !open && (
            <motion.div
              role="status"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-[68px] left-0 flex w-64 items-start gap-2 rounded-2xl rounded-bl-md border border-line bg-surface p-3.5 text-sm font-semibold text-ink shadow-[0_18px_50px_-16px_rgba(0,0,0,0.6)]"
            >
              <button type="button" onClick={openChat} className="text-left">
                {t.chat.nudge}
              </button>
              <button type="button" onClick={hideNudge} aria-label={t.chat.dismiss} className="-m-1 ml-auto grid size-8 shrink-0 place-items-center rounded-lg text-ink-soft hover:bg-bg-soft">
                <X className="size-4" aria-hidden />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          ref={launcherRef}
          type="button"
          onClick={openChat}
          aria-expanded={open}
          aria-controls="chat-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 20 }}
          className="flex h-14 items-center gap-3 rounded-full border border-line bg-surface py-1.5 pl-1.5 pr-5 text-sm font-bold text-ink shadow-[0_18px_50px_-16px_rgba(0,0,0,0.6)] transition-colors hover:border-gold"
        >
          <span className="relative grid size-11 place-items-center rounded-full bg-gold-bright text-navy">
            <Bot className="size-5" aria-hidden />
            <span className="absolute -right-0.5 -top-0.5 size-3 rounded-full border-2 border-surface bg-emerald-400" aria-hidden />
            <span className="absolute inset-0 animate-ping rounded-full bg-gold-bright/40 motion-reduce:hidden" aria-hidden />
          </span>
          {t.chat.launcher}
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="chat-panel"
            role="dialog"
            aria-labelledby={titleId}
            onKeyDown={onKeyDown}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-x-3 bottom-3 z-[55] flex max-h-[min(620px,calc(100dvh-24px))] flex-col overflow-hidden rounded-3xl border border-line bg-surface text-ink shadow-[0_30px_90px_-20px_rgba(0,0,0,0.7)] sm:inset-x-auto sm:bottom-5 sm:left-5 sm:w-[380px]"
          >
            <header className="flex items-center gap-3 border-b border-line bg-bg-soft px-4 py-3.5">
              <span className="grid size-10 place-items-center rounded-full bg-gold-bright text-navy">
                <Bot className="size-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <h2 id={titleId} className="font-display text-[15px] font-bold">{t.chat.title}</h2>
                <p className="flex items-center gap-1.5 text-xs font-semibold text-ink-soft">
                  <span className="size-2 rounded-full bg-emerald-400" aria-hidden />
                  {t.chat.status}
                </p>
              </div>
              <button type="button" onClick={close} aria-label={t.chat.close} className="ml-auto grid size-10 place-items-center rounded-xl hover:bg-surface">
                <X className="size-5" aria-hidden />
              </button>
            </header>

            <div ref={listRef} className="flex min-h-48 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-4 py-4" aria-live="polite">
              <Bubble role="assistant" text={t.chat.greeting} />
              {messages.map((m) => (
                <Bubble key={m.id} role={m.role} text={m.text} pending={m.pending} whatsapp={m.whatsapp} talk={t.chat.talk} waText={t.hero.whatsappMsg} />
              ))}
            </div>

            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 px-4 pb-3">
                {t.chat.quick.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => void ask(q)}
                    className="min-h-9 rounded-full border border-line bg-bg-soft px-3 text-[13px] font-semibold transition hover:border-gold"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={onSubmit} className="flex gap-2 border-t border-line p-3">
              <label htmlFor="chat-input" className="sr-only">{t.chat.inputLabel}</label>
              <input
                id="chat-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.chat.placeholder}
                autoComplete="off"
                maxLength={500}
                className="h-12 min-w-0 flex-1 rounded-xl border border-line bg-bg-soft px-3.5 text-[15px] text-ink placeholder:text-ink-soft focus:border-gold focus:outline-none"
              />
              <button
                type="submit"
                aria-label={t.chat.send}
                disabled={!input.trim() || ai.isPending}
                className="grid size-12 place-items-center rounded-xl bg-gold-bright text-navy transition disabled:opacity-50"
              >
                <Send className="size-5" aria-hidden />
              </button>
            </form>
            <p className="px-4 pb-3 text-center text-[11px] text-ink-soft">{t.chat.note}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({ role, text, pending, whatsapp, talk, waText }: { role: Msg["role"]; text: string; pending?: boolean; whatsapp?: boolean; talk?: string; waText?: string }) {
  const mine = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`max-w-[86%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed ${
        mine ? "self-end rounded-br-md bg-gold-bright font-semibold text-navy" : "self-start rounded-bl-md border border-line bg-bg-soft"
      }`}
    >
      {pending ? (
        <span className="flex gap-1 py-1" aria-label="…">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="size-1.5 rounded-full bg-ink-soft"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </span>
      ) : (
        <>
          {text}
          {whatsapp && talk && (
            <a
              href={whatsappLink(waText ?? "Hi Maha!")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 flex w-fit items-center gap-2 rounded-xl bg-[#22b35e] px-3 py-2 text-[13px] font-bold text-white"
            >
              <WhatsAppIcon className="size-4" />
              {talk}
            </a>
          )}
        </>
      )}
    </motion.div>
  );
}
