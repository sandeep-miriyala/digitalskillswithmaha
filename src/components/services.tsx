"use client";

import { Clapperboard, Link2, Megaphone, Palette, type LucideIcon } from "lucide-react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import type { PointerEvent } from "react";
import { useLanguage } from "@/i18n/language";

type Service = { icon: LucideIcon; accent: string; title: string; body: string };

const visuals = [
  { icon: Clapperboard, accent: "var(--gold-bright)" },
  { icon: Palette, accent: "var(--pink)" },
  { icon: Megaphone, accent: "var(--gold-bright)" },
  { icon: Link2, accent: "var(--pink)" },
];

function ServiceCard({ s, i }: { s: Service; i: number }) {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const glow = useMotionTemplate`radial-gradient(260px circle at ${x}px ${y}px, color-mix(in srgb, ${s.accent} 22%, transparent), transparent 70%)`;
  const onMove = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };
  const Icon = s.icon;

  return (
    <motion.li
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onPointerMove={onMove}
      className="group relative overflow-hidden rounded-3xl border border-line bg-surface p-7 transition-transform duration-300 hover:-translate-y-1.5"
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: glow }} />
      <span className="relative mb-6 grid size-13 place-items-center rounded-2xl border border-line bg-bg-soft" style={{ color: s.accent }}>
        <Icon className="size-6" aria-hidden />
      </span>
      <span className="absolute right-6 top-6 font-display text-sm font-bold text-ink-soft/60" aria-hidden>
        0{i + 1}
      </span>
      <h3 className="relative font-display text-xl font-bold tracking-tight">{s.title}</h3>
      <p className="relative mt-3 leading-relaxed text-ink-soft">{s.body}</p>
    </motion.li>
  );
}

export function Services() {
  const { t } = useLanguage();
  const services: Service[] = t.services.items.map((item, i) => ({ ...visuals[i], ...item }));
  return (
    <section id="services" aria-labelledby="services-title" className="relative border-y border-line bg-bg-soft py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-script text-2xl text-gold">{t.services.eyebrow}</p>
            <h2 id="services-title" className="mt-1 font-display text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold leading-none tracking-[-0.03em]">
              {t.services.title}
            </h2>
          </div>
          <p className="max-w-sm text-ink-soft">{t.services.sub}</p>
        </div>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <ServiceCard key={i} s={s} i={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
