"use client";

import { LayoutGrid, MessageSquareText } from "lucide-react";
import { useLanguage } from "@/i18n/language";
import { useSiteStyle, type SiteStyle } from "@/i18n/site-style";

/** Segmented switch between the LLM-style chat page and the classic page. */
export function StyleToggle({ className = "" }: { className?: string }) {
  const { t } = useLanguage();
  const { style, setStyle } = useSiteStyle();
  const options: { id: SiteStyle; label: string; Icon: typeof LayoutGrid }[] = [
    { id: "chat", label: t.style.chat, Icon: MessageSquareText },
    { id: "classic", label: t.style.classic, Icon: LayoutGrid },
  ];

  return (
    <div role="radiogroup" aria-label={t.style.label} className={`flex h-11 items-center gap-0.5 rounded-xl border border-line bg-surface p-1 ${className}`}>
      {options.map(({ id, label, Icon }) => {
        const active = style === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setStyle(id)}
            className={`flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] font-bold transition-[background-color,color,box-shadow] duration-300 ${
              active ? "bg-gold-bright text-navy shadow-[0_6px_16px_-8px_var(--ring)]" : "text-ink-soft hover:text-ink"
            }`}
          >
            <Icon className="size-4" aria-hidden />
            {label}
          </button>
        );
      })}
    </div>
  );
}
