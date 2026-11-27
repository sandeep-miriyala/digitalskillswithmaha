"use client";

import Image from "next/image";
import { ClipboardList } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import logo from "../../public/brand/logo.webp";
import { useLanguage } from "@/i18n/language";
import { site } from "@/lib/site";
import { goToRegister } from "./chat-parts";
import { InstallButton } from "./install-button";
import { LanguageToggle } from "./language-toggle";
import { StyleToggle } from "./style-toggle";
import { ThemeToggle } from "./theme-toggle";
import { TodayDate } from "./today-date";

function RegisterButton({ className = "" }: { className?: string }) {
  const { t } = useLanguage();
  return (
    <button
      type="button"
      onClick={goToRegister}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gold-bright px-4 text-sm font-extrabold text-navy shadow-[0_8px_24px_-10px_var(--ring)] transition hover:-translate-y-0.5 ${className}`}
    >
      <ClipboardList className="size-4" aria-hidden />
      {t.nav.register}
    </button>
  );
}

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
        scrolled ? "border-b border-line bg-bg/80 backdrop-blur-xl" : "border-b border-transparent bg-bg/40 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center gap-2 px-4 sm:gap-3 sm:px-6">
        <a href="#home" className="flex shrink-0 items-center gap-3" aria-label={`${site.name} home`}>
          <Image src={logo} alt="" width={44} height={44} priority className="size-11 rounded-full ring-2 ring-gold/60" />
          <span className="hidden leading-tight md:block">
            <span className="block font-display text-[17px] font-bold tracking-tight">Digital Skills</span>
            <span className="block font-script text-lg leading-none text-gold">with Maha</span>
          </span>
        </a>

        <nav aria-label="Main" className="ml-4 hidden items-center gap-0.5 xl:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-ink-soft transition hover:bg-surface hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <div className="hidden sm:block">
            <StyleToggle />
          </div>
          <TodayDate />
          <LanguageToggle />
          <ThemeToggle />
          <InstallButton compact />
          <div className="hidden sm:block">
            <RegisterButton />
          </div>
        </div>
      </div>

      {/* Phones: style switch + Register on a slim second row */}
      <div className="flex items-center gap-2 px-4 pb-2.5 sm:hidden">
        <StyleToggle className="flex-1 [&>button]:flex-1 [&>button]:justify-center" />
        <RegisterButton className="h-11 px-3" />
      </div>
    </motion.header>
  );
}
