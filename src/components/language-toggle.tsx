"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLanguage } from "@/i18n/language";

export function LanguageToggle() {
  const { lang, setLang, t } = useLanguage();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === "en" ? "te" : "en")}
      aria-label={t.lang.label}
      title={t.lang.label}
      className="grid h-11 min-w-11 place-items-center overflow-hidden rounded-xl border border-line bg-surface px-3 text-[15px] font-bold text-ink transition hover:border-gold"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={lang}
          lang={lang === "en" ? "te" : "en"}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {t.lang.switchTo}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
