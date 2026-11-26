"use client";

import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useState } from "react";
import { useLanguage } from "@/i18n/language";

/** Floating "go to top" button with a gold ring that fills as you scroll. */
export function BackToTop() {
  const { lang } = useLanguage();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const [visible, setVisible] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > 600));

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    document.getElementById("main")?.focus({ preventScroll: true });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={toTop}
          aria-label={lang === "te" ? "పైకి వెళ్ళండి" : "Back to top"}
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="group fixed bottom-5 right-5 z-[54] grid size-14 place-items-center rounded-full bg-surface text-ink shadow-[0_16px_40px_-14px_rgba(0,0,0,0.6)]"
        >
          <svg viewBox="0 0 56 56" className="absolute inset-0 size-full -rotate-90" aria-hidden>
            <circle cx="28" cy="28" r="25" fill="none" stroke="var(--line)" strokeWidth="3" />
            <motion.circle
              cx="28"
              cy="28"
              r="25"
              fill="none"
              stroke="var(--gold-bright)"
              strokeWidth="3"
              strokeLinecap="round"
              style={{ pathLength: progress }}
            />
          </svg>
          <span className="relative grid size-10 place-items-center rounded-full bg-gold-bright text-navy transition group-hover:bg-[var(--pink)] group-hover:text-white">
            <ArrowUp className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden />
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
