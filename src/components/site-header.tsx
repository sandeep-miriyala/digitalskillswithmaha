"use client";

import Image from "next/image";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import logo from "../../public/brand/logo.webp";
import { useLanguage } from "@/i18n/language";
import { site } from "@/lib/site";
import { LanguageToggle } from "./language-toggle";
import { TodayDate } from "./today-date";
import { InstallButton } from "./install-button";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  const { t } = useLanguage();
  const nav = [
    { href: "#home", label: t.nav.home },
    { href: "#services", label: t.nav.services },
    { href: "#reviews", label: t.nav.reviews },
    { href: "#contact", label: t.nav.contact },
  ];
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 12));

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled ? "border-b border-line bg-bg/75 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-18 max-w-6xl items-center gap-3 px-4 sm:gap-4 sm:px-8">
        <a href="#home" className="flex items-center gap-3" aria-label={`${site.name} home`}>
          <Image src={logo} alt="" width={44} height={44} priority className="size-11 rounded-full ring-2 ring-gold/60" />
          <span className="hidden leading-tight sm:block">
            <span className="block font-display text-[17px] font-bold tracking-tight">Digital Skills</span>
            <span className="block font-script text-lg leading-none text-gold">with Maha</span>
          </span>
        </a>

        <nav aria-label="Main" className="ml-auto hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3.5 py-2 text-sm font-semibold text-ink-soft transition hover:bg-surface hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2 md:ml-2">
          <TodayDate />
          <LanguageToggle />
          <ThemeToggle />
          <InstallButton compact />
        </div>
      </div>
    </motion.header>
  );
}
