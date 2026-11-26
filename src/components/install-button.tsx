"use client";

import { Download, Share, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n/language";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallButton({ compact = false }: { compact?: boolean }) {
  const { t } = useLanguage();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);
    // read device state once after mount
    queueMicrotask(() => {
      setInstalled(standalone);
      setIsIOS(ios);
    });
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed || (!deferred && !isIOS)) return null;

  const onClick = async () => {
    if (deferred) {
      await deferred.prompt();
      await deferred.userChoice;
      setDeferred(null);
    } else {
      setShowHelp(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className="inline-flex h-11 items-center gap-2 rounded-xl bg-gold-bright px-4 text-sm font-bold text-navy shadow-[0_8px_24px_-10px_var(--ring)] transition hover:-translate-y-0.5"
      >
        <Download className="size-4" aria-hidden />
        <span className={compact ? "sr-only sm:not-sr-only" : ""}>{t.install.button}</span>
      </button>

      <AnimatePresence>
        {showHelp && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t.install.iosTitle}
            className="fixed inset-0 z-[80] grid place-items-end bg-black/50 p-4 sm:place-items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              exit={{ y: 40 }}
              className="w-full max-w-sm rounded-3xl border border-line bg-surface p-6 text-ink"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold">{t.install.iosTitle}</h2>
                <button type="button" aria-label={t.install.close} onClick={() => setShowHelp(false)} className="grid size-10 place-items-center rounded-lg hover:bg-bg-soft">
                  <X className="size-5" />
                </button>
              </div>
              <ol className="space-y-2 text-ink-soft">
                {t.install.iosSteps.map((step, i) => (
                  <li key={i} className="flex items-center gap-2">
                    {i + 1}. {step}
                    {i === 1 && <Share className="size-4 text-ink" aria-hidden />}
                  </li>
                ))}
              </ol>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
