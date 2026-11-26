"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, type PointerEvent } from "react";
import logo from "../../public/brand/logo.webp";
import { useLanguage } from "@/i18n/language";
import { whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "./brand-icons";
import { SkillOfTheDay } from "./skill-of-the-day";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { lang, t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const badgeY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  // cursor spotlight
  const mx = useMotionValue(50);
  const my = useMotionValue(40);
  const sx = useSpring(mx, { stiffness: 80, damping: 20 });
  const sy = useSpring(my, { stiffness: 80, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${sx}% ${sy}%, color-mix(in srgb, var(--gold-bright) 16%, transparent), transparent 60%)`;
  const onMove = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  };

  return (
    <section
      id="home"
      ref={ref}
      onPointerMove={onMove}
      className="relative isolate overflow-hidden"
      aria-labelledby="hero-title"
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ background: spotlight }} />
      <div aria-hidden className="pointer-events-none absolute -left-40 bottom-0 -z-10 size-[520px] rounded-full bg-pink/15 blur-3xl" />

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-24 pt-14 sm:px-8 md:pt-20 lg:grid-cols-[1.15fr_0.85fr] lg:pb-32">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-6 inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-line bg-surface/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-ink-soft"
          >
            {t.pillars.map((p, i) => (
              <span key={p} className="flex items-center gap-2">
                {i > 0 && <span className="size-1 rounded-full bg-gold" aria-hidden />}
                {p}
              </span>
            ))}
          </motion.p>

          <h1 id="hero-title" className="font-display text-[clamp(2.75rem,7vw,5.25rem)] font-extrabold leading-[0.98] tracking-[-0.035em]">
            <span className="sr-only">{t.hero.headline}</span>
            <span aria-hidden key={lang}>
              {t.hero.words.map((w, i) => (
                <motion.span
                  key={`${lang}-${i}`}
                  className="mr-[0.22em] inline-block"
                  initial={{ opacity: 0, y: "0.5em", filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.15 + i * 0.09, duration: 0.7, ease }}
                >
                  {w}
                </motion.span>
              ))}
              <motion.span
                className="relative inline-block font-script text-[1.12em] font-bold tracking-normal text-gold"
                initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
                animate={{ opacity: 1, scale: 1, rotate: -3 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 160, damping: 12 }}
              >
                {t.hero.accent}
                <motion.svg
                  viewBox="0 0 300 24"
                  className="absolute -bottom-2 left-0 w-full text-pink"
                  fill="none"
                  aria-hidden
                >
                  <motion.path
                    d="M4 16 C 70 4, 150 4, 296 14"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1, duration: 0.8, ease }}
                  />
                </motion.svg>
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.7, ease }}
            className="mt-8 max-w-xl text-lg leading-relaxed text-ink-soft"
          >
            {t.hero.lead}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7, ease }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <a
              href="#services"
              className="group inline-flex h-14 items-center gap-2 rounded-2xl bg-gold-bright px-7 font-bold text-navy shadow-[0_14px_40px_-14px_var(--ring)] transition hover:-translate-y-0.5"
            >
              {t.hero.explore}
              <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden />
            </a>
            <a
              href={whatsappLink(t.hero.whatsappMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center gap-2 rounded-2xl border border-line bg-surface px-7 font-bold transition hover:-translate-y-0.5 hover:border-gold"
            >
              <WhatsAppIcon className="size-5 text-[#22b35e]" />
              {t.hero.whatsapp}
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-10 font-script text-3xl text-ink-soft"
          >
            {t.hero.taglineA} <span className="text-gold">{t.hero.taglineB}</span>
          </motion.p>
        </div>

        <motion.div style={{ y: badgeY }} className="relative mx-auto w-full max-w-[440px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease }}
            className="relative aspect-square"
          >
            <div
              aria-hidden
              className="absolute -inset-4 animate-spin-slow rounded-full bg-[conic-gradient(from_0deg,var(--gold-bright),transparent_30%,var(--pink)_55%,transparent_75%,var(--gold-bright))] opacity-70 blur-[2px]"
            />
            <div aria-hidden className="absolute -inset-1 rounded-full bg-bg" />
            <Image
              src={logo}
              alt={t.hero.logoAlt}
              priority
              sizes="(min-width: 1024px) 440px, 90vw"
              className="relative size-full rounded-full shadow-[0_40px_90px_-30px_rgba(0,0,0,0.6)]"
            />
          </motion.div>
          <div className="relative z-10 -mt-10 flex justify-center lg:absolute lg:-bottom-28 lg:-left-20 lg:mt-0">
            <SkillOfTheDay />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
