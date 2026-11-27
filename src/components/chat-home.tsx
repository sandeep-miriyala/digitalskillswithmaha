"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, ClipboardList, Mail, Mic, Phone, Plus, Sparkles, Square, Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import logo from "../../public/brand/logo.webp";
import { useLanguage } from "@/i18n/language";
import { site } from "@/lib/site";
import { useMahaChat } from "@/lib/use-maha-chat";
import { InstagramIcon, WhatsAppIcon, YouTubeIcon } from "./brand-icons";
import { ChatRow, goToRegister, serviceVisuals } from "./chat-parts";
import { fetchSkills, todaysIndex } from "./skill-of-the-day";

const ease = [0.22, 1, 0.36, 1] as const;

/* ---------- Voice input (Web Speech API, Chrome/Android/Edge/Safari) ---------- */
type Recognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};
type RecognitionCtor = new () => Recognition;

function getRecognition(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function useVoice(lang: "en" | "te", onText: (t: string) => void) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const rec = useRef<Recognition | null>(null);

  useEffect(() => {
    queueMicrotask(() => setSupported(getRecognition() !== null));
  }, []);

  const toggle = () => {
    if (listening) {
      rec.current?.stop();
      return;
    }
    const Ctor = getRecognition();
    if (!Ctor) return;
    const r = new Ctor();
    r.lang = lang === "te" ? "te-IN" : "en-IN";
    r.interimResults = true;
    r.continuous = false;
    r.onresult = (e) => onText(Array.from(e.results).map((res) => res[0].transcript).join(""));
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    rec.current = r;
    setListening(true);
    r.start();
  };

  return { supported, listening, toggle };
}

/* ---------- Composer (input box) ---------- */
function Composer({
  onSend,
  busy,
  placeholder,
  big = false,
}: {
  onSend: (text: string) => void;
  busy: boolean;
  placeholder: string;
  big?: boolean;
}) {
  const { lang, t } = useLanguage();
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  const voice = useVoice(lang, setValue);

  // grow the textarea with its content (max ~5 lines)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [value]);

  const send = (e?: FormEvent) => {
    e?.preventDefault();
    if (!value.trim() || busy) return;
    onSend(value);
    setValue("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <form
      onSubmit={send}
      className={`w-full rounded-3xl border border-line bg-surface text-left shadow-[0_30px_80px_-30px_rgba(0,0,0,0.55),0_0_0_6px_color-mix(in_srgb,var(--gold-bright)_8%,transparent)] transition focus-within:border-gold ${big ? "p-4 pl-5" : "p-3 pl-4"}`}
    >
      <label htmlFor={big ? "ask-big" : "ask-dock"} className="sr-only">
        {t.chat.inputLabel}
      </label>
      <textarea
        id={big ? "ask-big" : "ask-dock"}
        ref={ref}
        rows={1}
        value={value}
        maxLength={500}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={`block w-full resize-none bg-transparent text-ink placeholder:text-ink-soft focus:outline-none ${big ? "min-h-12 text-[17px]" : "min-h-7 text-[15px]"}`}
      />
      <div className="mt-2 flex items-center gap-2">
        {big && (
          <span className="flex h-8 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-bold text-ink-soft">
            <Sparkles className="size-3.5 text-gold" aria-hidden />
            AI · తె / EN
          </span>
        )}
        {voice.supported && (
          <button
            type="button"
            onClick={voice.toggle}
            aria-label={voice.listening ? "Stop voice input" : "Speak your question"}
            aria-pressed={voice.listening}
            className={`ml-auto grid size-11 place-items-center rounded-2xl border transition ${voice.listening ? "animate-pulse border-pink bg-pink text-white" : "border-line text-ink hover:border-gold"}`}
          >
            {voice.listening ? <Square className="size-4" aria-hidden /> : <Mic className="size-5" aria-hidden />}
          </button>
        )}
        <button
          type="submit"
          aria-label={t.chat.send}
          disabled={!value.trim() || busy}
          className={`grid size-11 place-items-center rounded-2xl bg-gold-bright text-navy transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50 ${voice.supported ? "" : "ml-auto"}`}
        >
          <ArrowUp className="size-5" aria-hidden />
        </button>
      </div>
    </form>
  );
}

/* ---------- Chat-style home ---------- */
export function ChatHome() {
  const { lang, t } = useLanguage();
  const { messages, ask, reset, busy } = useMahaChat();
  const listRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const started = messages.length > 0;
  const { data: skills } = useQuery({ queryKey: ["skills"], queryFn: fetchSkills });
  const skill = skills?.length ? skills[todaysIndex(skills.length)] : null;

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    if (!started) stageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    void ask(text);
  };

  const lastIsDone = started && !messages[messages.length - 1]?.pending;

  return (
    <section
      id="home"
      ref={stageRef}
      aria-label={t.chatHome.title}
      className="relative isolate overflow-hidden border-b border-line"
    >
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-52 -z-10 size-[640px] rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--gold-bright)_20%,transparent),transparent)]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-64 -left-56 -z-10 size-[580px] rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--pink)_16%,transparent),transparent)]" />

      <AnimatePresence mode="wait" initial={false}>
        {!started ? (
          /* ---------------- First visit ---------------- */
          <motion.div
            key="intro"
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="mx-auto flex min-h-[calc(100dvh-var(--header-h))] max-w-3xl flex-col items-center justify-center gap-5 px-5 py-12 text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease }}
              className="relative size-24"
            >
              <div aria-hidden className="absolute -inset-2 animate-spin-slow rounded-full bg-[conic-gradient(from_20deg,var(--gold-bright),transparent_30%,var(--pink)_55%,transparent_75%,var(--gold-bright))] opacity-80" />
              <div aria-hidden className="absolute -inset-0.5 rounded-full bg-bg" />
              <Image src={logo} alt="Maha" priority className="relative size-full rounded-full" />
              <span className="absolute bottom-1 right-1 size-4 rounded-full border-[3px] border-bg bg-emerald-400" aria-hidden />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6, ease }}
              className={`font-script text-gold ${lang === "te" ? "text-2xl" : "text-4xl"}`}
            >
              {t.chatHome.hi}
            </motion.p>
            <motion.h1
              key={lang}
              initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.25, duration: 0.7, ease }}
              className={`font-display font-extrabold leading-[1.05] tracking-[-0.03em] [overflow-wrap:anywhere] ${lang === "te" ? "text-[clamp(1.55rem,5.6vw,3rem)]" : "text-[clamp(2.1rem,6vw,3.6rem)]"}`}
            >
              {t.chatHome.title}
            </motion.h1>

            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6, ease }} className="w-full">
              <Composer big onSend={send} busy={busy} placeholder={t.chatHome.placeholder} />
            </motion.div>
            <p className="text-[12.5px] text-ink-soft">{t.chatHome.hint}</p>

            <ul className="grid w-full grid-cols-2 gap-3 md:grid-cols-4">
              {t.chatHome.chips.map((c, i) => {
                const { Icon, accent } = serviceVisuals[i];
                return (
                  <motion.li key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.07, duration: 0.5, ease }}>
                    <button
                      type="button"
                      onClick={() => send(c.ask)}
                      className="flex h-full w-full flex-col gap-2.5 rounded-2xl border border-line bg-surface p-3.5 text-left transition hover:-translate-y-1 hover:border-gold"
                    >
                      <span className="grid size-9 place-items-center rounded-xl bg-bg-soft" style={{ color: accent }}>
                        <Icon className="size-[18px]" aria-hidden />
                      </span>
                      <span className="text-sm font-bold leading-snug">
                        {c.title}
                        <span className="mt-0.5 hidden text-xs font-medium text-ink-soft sm:block">{c.sub}</span>
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </ul>

            <div className="grid w-full gap-3 sm:grid-cols-[1.3fr_1fr]">
              <div className="rounded-2xl border border-line bg-bg-soft px-4 py-3.5 text-left">
                <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-gold">
                  <Sparkles className="size-3.5" aria-hidden />
                  {t.skill.label}
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {skill ? (lang === "te" ? `${skill.title_te} — ${skill.body_te}` : `${skill.title} — ${skill.body}`) : "…"}
                </p>
              </div>
              <a href="#reviews" className="hidden rounded-2xl border border-dashed border-line bg-bg-soft px-4 py-3.5 text-left text-[13px] text-ink-soft transition hover:border-gold sm:block">
                <span className="flex items-center gap-2">
                  <span className="flex text-gold-bright" aria-label="5 / 5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className="size-3.5 fill-current" aria-hidden />
                    ))}
                  </span>
                  <span className="rounded-full border border-dashed border-ink-soft/50 px-1.5 text-[10px] font-bold uppercase">{t.reviews.sample}</span>
                </span>
                “{t.chatHome.reviewsTeaser}”
              </a>
            </div>

            <a href="#services" className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft transition hover:text-gold">
              {t.chatHome.more}
              <ArrowDown className="size-4 animate-bounce" aria-hidden />
            </a>
          </motion.div>
        ) : (
          /* ---------------- Conversation ---------------- */
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mx-auto flex h-[calc(100dvh-var(--header-h))] max-w-7xl"
          >
            <aside className="hidden w-64 shrink-0 flex-col gap-1 border-r border-line bg-bg-soft/60 p-4 lg:flex">
              <button
                type="button"
                onClick={reset}
                className="mb-3 flex h-11 items-center gap-2 rounded-xl bg-gold-bright px-4 text-sm font-extrabold text-navy transition hover:-translate-y-0.5"
              >
                <Plus className="size-4" aria-hidden />
                {t.chatHome.newChat}
              </button>
              <p className="mx-2 mb-1 mt-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink-soft">{t.chatHome.servicesHead}</p>
              {t.services.items.map((s, i) => {
                const { Icon, accent } = serviceVisuals[i];
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => send(t.chatHome.chips[i].ask)}
                    disabled={busy}
                    className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm font-semibold transition hover:bg-surface disabled:opacity-60"
                  >
                    <Icon className="size-4 shrink-0" style={{ color: accent }} aria-hidden />
                    {s.title}
                  </button>
                );
              })}
              <p className="mx-2 mb-1 mt-4 text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink-soft">{t.chatHome.mahaHead}</p>
              {[
                { label: t.chatHome.sideLinks[0], Icon: ClipboardList, onClick: goToRegister },
                { label: t.chatHome.sideLinks[1], Icon: Star, href: "#reviews" },
                { label: t.chatHome.sideLinks[2], Icon: Phone, href: "#contact" },
              ].map(({ label, Icon, href, onClick }) =>
                href ? (
                  <a key={label} href={href} className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-semibold transition hover:bg-surface">
                    <Icon className="size-4 text-gold" aria-hidden />
                    {label}
                  </a>
                ) : (
                  <button key={label} type="button" onClick={onClick} className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm font-semibold transition hover:bg-surface">
                    <Icon className="size-4 text-gold" aria-hidden />
                    {label}
                  </button>
                ),
              )}
              <div className="mt-auto flex gap-2 px-1 pt-4">
                {[
                  { href: site.links.whatsapp, Icon: WhatsAppIcon, label: "WhatsApp", color: "#22b35e" },
                  { href: site.links.instagram, Icon: InstagramIcon, label: "Instagram", color: "#e1306c" },
                  { href: site.links.youtube, Icon: YouTubeIcon, label: "YouTube", color: "#e03b3b" },
                  { href: site.links.email, Icon: Mail, label: "Email", color: "var(--gold)" },
                ].map(({ href, Icon, label, color }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid size-10 place-items-center rounded-xl border border-line bg-surface transition hover:border-gold"
                  >
                    <Icon className="size-[18px]" style={{ color }} />
                  </a>
                ))}
              </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-center justify-between px-4 pt-3 lg:hidden">
                <button type="button" onClick={reset} className="flex h-10 items-center gap-1.5 rounded-xl border border-line bg-surface px-3 text-[13px] font-bold">
                  <Plus className="size-4" aria-hidden />
                  {t.chatHome.newChat}
                </button>
                <button type="button" onClick={goToRegister} className="flex h-10 items-center gap-1.5 rounded-xl border border-line bg-surface px-3 text-[13px] font-bold">
                  <ClipboardList className="size-4 text-gold" aria-hidden />
                  {t.nav.register}
                </button>
              </div>

              <div ref={listRef} className="flex-1 overflow-y-auto overscroll-contain" aria-live="polite">
                <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6 sm:px-7">
                  {messages.map((m) => (
                    <ChatRow key={m.id} msg={m} rich />
                  ))}
                  {lastIsDone && (
                    <div className="flex flex-wrap gap-2 pl-12">
                      {t.chatHome.followUps.map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => send(f)}
                          className="min-h-9 rounded-full border border-line bg-surface px-3.5 text-[13px] font-semibold transition hover:border-gold"
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-t from-bg via-bg to-transparent px-4 pb-4 pt-3 sm:px-7">
                <div className="mx-auto max-w-3xl">
                  <Composer onSend={send} busy={busy} placeholder={t.chatHome.placeholderFollow} />
                  <p className="mt-2 text-center text-[11.5px] text-ink-soft">{t.chatHome.disclaimer}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
