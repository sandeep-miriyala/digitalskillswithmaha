"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { dictionaries, type Lang } from "./dictionary";

const KEY = "dswm-lang";
const listeners = new Set<() => void>();

function read(): Lang {
  try {
    return localStorage.getItem(KEY) === "te" ? "te" : "en";
  } catch {
    return "en";
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => e.key === KEY && cb();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

/** Current language + dictionary. English is rendered at build time; Telugu swaps in on the client. */
export function useLanguage() {
  const lang = useSyncExternalStore(subscribe, read, () => "en" as Lang);

  const setLang = useCallback((next: Lang) => {
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* private mode: language still switches for this visit */
    }
    listeners.forEach((l) => l());
  }, []);

  return { lang, setLang, t: dictionaries[lang] };
}

/** Keeps <html lang> in sync so screen readers and fonts pick the right language. */
export function HtmlLang() {
  const { lang } = useLanguage();
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
