"use client";

import { Bot, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useLanguage } from "@/i18n/language";
import { useMahaChat } from "@/lib/use-maha-chat";
import { ChatRow } from "./chat-parts";

/** Floating "Maha" assistant (bottom-left). Used in the Classic page style. */
export function ChatAssistant() {
  const { t } = useLanguage();
  const { messages, ask, reset, busy } = useMahaChat();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [nudge, setNudge] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

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
    setInput("");
    reset();
    requestAnimationFrame(() => launcherRef.current?.focus());
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void ask(input);
    setInput("");
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") close();
  };

  return (
    <>
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
              <div className="max-w-[90%] self-start whitespace-pre-line rounded-2xl rounded-bl-md border border-line bg-bg-soft px-3.5 py-2.5 text-[14px] leading-relaxed">
                {t.chat.greeting}
              </div>
              {messages.map((m) => (
                <ChatRow key={m.id} msg={m} onAction={close} />
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
                disabled={!input.trim() || busy}
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
