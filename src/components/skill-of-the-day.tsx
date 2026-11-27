"use client";

import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "@/i18n/language";
import { asset } from "@/lib/site";

export type Skill = { title: string; body: string; tag: string; title_te: string; body_te: string; tag_te: string };

export async function fetchSkills(): Promise<Skill[]> {
  const res = await fetch(asset("/content/skills.json"));
  if (!res.ok) throw new Error("Could not load skills");
  const data = (await res.json()) as { skills: Skill[] };
  return data.skills;
}

/** Picks the same skill for everyone on a given day. */
export function todaysIndex(count: number) {
  const day = Math.floor(Date.now() / 86_400_000);
  return day % count;
}

export function SkillOfTheDay() {
  const { lang, t } = useLanguage();
  const { data, isPending, isError } = useQuery({ queryKey: ["skills"], queryFn: fetchSkills });
  const skill = data?.length ? data[todaysIndex(data.length)] : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: -2 }}
      whileHover={{ rotate: 0, y: -4 }}
      transition={{ delay: 0.7, type: "spring", stiffness: 140, damping: 16 }}
      className="w-72 rounded-2xl border border-line bg-surface/95 p-5 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.55)] backdrop-blur"
      aria-live="polite"
    >
      <p className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-gold">
        <Sparkles className="size-3.5" aria-hidden />
        {t.skill.label}
      </p>
      {isPending && (
        <div className="space-y-2" aria-label={t.skill.loading}>
          <div className="h-4 w-3/4 animate-pulse rounded bg-bg-soft" />
          <div className="h-3 w-full animate-pulse rounded bg-bg-soft" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-bg-soft" />
        </div>
      )}
      {isError && <p className="text-sm text-ink-soft">{t.skill.error}</p>}
      {skill && (
        <>
          <h3 className="font-display text-lg font-bold leading-snug">{lang === "te" ? skill.title_te : skill.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{lang === "te" ? skill.body_te : skill.body}</p>
          <span className="mt-3 inline-block rounded-full bg-pink/12 px-2.5 py-1 text-[11px] font-bold text-pink">
            {lang === "te" ? skill.tag_te : skill.tag}
          </span>
        </>
      )}
    </motion.article>
  );
}
