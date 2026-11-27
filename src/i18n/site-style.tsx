"use client";

import { useCallback, useSyncExternalStore } from "react";
import { site } from "@/lib/site";

export type SiteStyle = "chat" | "classic";

const KEY = "dswm-style";
const listeners = new Set<() => void>();

/** URL ?style=chat|classic wins (handy for sharing/testing), then the saved choice, then the default. */
function read(): SiteStyle {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("style");
    if (fromUrl === "chat" || fromUrl === "classic") return fromUrl;
    const saved = localStorage.getItem(KEY);
    if (saved === "chat" || saved === "classic") return saved;
  } catch {
    /* ignore */
  }
  return site.defaultStyle;
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

export function useSiteStyle() {
  const style = useSyncExternalStore(subscribe, read, () => site.defaultStyle);

  const setStyle = useCallback((next: SiteStyle) => {
    try {
      localStorage.setItem(KEY, next);
      const url = new URL(window.location.href);
      if (url.searchParams.has("style")) {
        url.searchParams.delete("style");
        window.history.replaceState(null, "", url);
      }
    } catch {
      /* ignore */
    }
    listeners.forEach((l) => l());
    window.scrollTo({ top: 0 });
  }, []);

  return { style, setStyle };
}
