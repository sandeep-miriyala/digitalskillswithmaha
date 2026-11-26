"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Lenis from "lenis";
import { MotionConfig } from "motion/react";
import { ThemeProvider } from "next-themes";
import { useEffect, useState, type ReactNode } from "react";
import { asset } from "@/lib/site";

function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -80 } });
    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
}

function useServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register(asset("/sw.js"), { scope: asset("/") }).catch(() => {
      /* offline support is a progressive enhancement */
    });
  }, []);
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 1000 * 60 * 60, gcTime: 1000 * 60 * 60 * 24, refetchOnWindowFocus: false, retry: 1 },
        },
      }),
  );

  useSmoothScroll();
  useServiceWorker();

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
      <QueryClientProvider client={queryClient}>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
