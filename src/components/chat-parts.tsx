"use client";

import Image from "next/image";
import { ClipboardList, Clapperboard, Link2, Megaphone, Palette, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import logo from "../../public/brand/logo.webp";
import { useLanguage } from "@/i18n/language";
import type { ChatMsg } from "@/lib/use-maha-chat";
import { whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "./brand-icons";

export const serviceVisuals: { Icon: LucideIcon; accent: string }[] = [
  { Icon: Clapperboard, accent: "var(--gold-bright)" },
  { Icon: Palette, accent: "var(--pink)" },
  { Icon: Megaphone, accent: "#5aa9ff" },
  { Icon: Link2, accent: "#34d399" },
];

/** Scrolls to the registration form (works in both page styles). */
export function goToRegister() {
  const el = document.getElementById("register");
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => document.querySelector<HTMLInputElement>('[data-reg="name"]')?.focus({ preventScroll: true }), 700);
}

export function TypingDots() {
  return (
    <span className="flex gap-1 py-1.5" role="status" aria-label="…">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-ink-soft"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}

/** WhatsApp / Register buttons and the service card under an answer. */
export function AnswerExtras({ msg, rich = false, onAction }: { msg: ChatMsg; rich?: boolean; onAction?: () => void }) {
  const { t } = useLanguage();
  const service = msg.service !== undefined ? t.services.items[msg.service] : null;
  const visual = msg.service !== undefined ? serviceVisuals[msg.service] : null;

  const waBtn = (
    <a
      href={whatsappLink(t.hero.whatsappMsg)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#22b35e] px-3.5 text-[13px] font-bold text-white transition hover:brightness-110"
    >
      <WhatsAppIcon className="size-4" />
      {rich ? t.chatHome.bookCall : t.chat.talk}
    </a>
  );
  const regBtn = (
    <button
      type="button"
      onClick={() => {
        onAction?.();
        goToRegister();
      }}
      className="inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-surface px-3.5 text-[13px] font-bold transition hover:border-gold"
    >
      <ClipboardList className="size-4 text-gold" aria-hidden />
      {t.chatHome.registerNow}
    </button>
  );

  if (service && visual) {
    const Icon = visual.Icon;
    return (
      <div className={`mt-3 rounded-2xl border border-line bg-surface p-4 ${rich ? "max-w-md" : ""}`}>
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-bg-soft" style={{ color: visual.accent }}>
            <Icon className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="font-display text-[15px] font-bold">{service.title}</p>
            <p className="text-xs text-ink-soft">{t.services.sub}</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {waBtn}
          {regBtn}
        </div>
      </div>
    );
  }

  if (!msg.whatsapp && !msg.register) return null;
  return (
    <div className="mt-2.5 flex flex-wrap gap-2">
      {msg.whatsapp && waBtn}
      {msg.register && regBtn}
    </div>
  );
}

/** One message row: user bubble on the right, Maha (with avatar in rich mode) on the left. */
export function ChatRow({ msg, rich = false, onAction }: { msg: ChatMsg; rich?: boolean; onAction?: () => void }) {
  const { t } = useLanguage();
  if (msg.role === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`self-end whitespace-pre-line rounded-2xl rounded-br-md bg-gold-bright px-4 py-2.5 font-semibold text-navy ${rich ? "max-w-[78%] text-[15px]" : "max-w-[86%] text-[14px]"}`}
      >
        {msg.text}
      </motion.div>
    );
  }
  if (!rich) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[90%] self-start whitespace-pre-line rounded-2xl rounded-bl-md border border-line bg-bg-soft px-3.5 py-2.5 text-[14px] leading-relaxed"
      >
        {msg.pending ? <TypingDots /> : msg.text}
        {!msg.pending && <AnswerExtras msg={msg} onAction={onAction} />}
      </motion.div>
    );
  }
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3">
      <Image src={logo} alt="" width={36} height={36} className="size-9 shrink-0 rounded-full ring-2 ring-gold/60" />
      <div className="min-w-0 flex-1">
        <p className="mb-0.5 flex items-center gap-2 text-[13px] font-extrabold text-gold">
          {t.chat.title}
          <span className="rounded-md border border-line px-1.5 text-[10px] text-ink-soft">AI</span>
        </p>
        {msg.pending ? (
          <TypingDots />
        ) : (
          <div className="whitespace-pre-line text-[15px] leading-relaxed">{msg.text}</div>
        )}
        {!msg.pending && <AnswerExtras msg={msg} rich onAction={onAction} />}
      </div>
    </motion.div>
  );
}
