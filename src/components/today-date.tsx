"use client";

import { CalendarDays } from "lucide-react";
import { useSyncExternalStore } from "react";
import { useLanguage } from "@/i18n/language";

/** DD-MM-YYYY in the visitor's local time. */
function format(d: Date) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}-${mm}-${d.getFullYear()}`;
}

// Re-check every minute so the date rolls over at midnight without a reload.
function subscribe(cb: () => void) {
  const id = window.setInterval(cb, 60_000);
  return () => window.clearInterval(id);
}

export function TodayDate() {
  const { t } = useLanguage();
  // Empty during the static build; filled with the real date in the browser.
  const today = useSyncExternalStore(subscribe, () => format(new Date()), () => "");
  if (!today) return <span className="hidden h-11 w-[118px] sm:block" aria-hidden />;

  return (
    <time
      dateTime={today.split("-").reverse().join("-")}
      title={t.today}
      className="flex h-11 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-[13px] font-bold tabular-nums text-ink"
    >
      <CalendarDays className="size-4 text-gold" aria-hidden />
      <span className="sr-only">{t.today}: </span>
      {today}
    </time>
  );
}
