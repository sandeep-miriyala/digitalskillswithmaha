"use client";

import { useQuery } from "@tanstack/react-query";
import { Quote, Star } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "@/i18n/language";
import { asset } from "@/lib/site";

type Testimonial = {
  sample?: boolean;
  name: string;
  role: string;
  role_te: string;
  service: string;
  service_te: string;
  rating: number;
  quote: string;
  quote_te: string;
};

async function fetchTestimonials(): Promise<Testimonial[]> {
  const res = await fetch(asset("/content/testimonials.json"));
  if (!res.ok) throw new Error("Could not load testimonials");
  return ((await res.json()) as { testimonials: Testimonial[] }).testimonials;
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function Card({ item, te, sampleLabel, ratingLabel }: { item: Testimonial; te: boolean; sampleLabel: string; ratingLabel: string }) {
  return (
    <figure className="relative flex w-[320px] shrink-0 flex-col gap-5 rounded-3xl border border-line bg-surface p-7 sm:w-[360px]">
      <Quote className="absolute right-6 top-6 size-8 text-gold/25" aria-hidden />
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5 text-gold-bright" role="img" aria-label={`${item.rating} ${ratingLabel} 5`}>
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className={`size-4 ${i < item.rating ? "fill-current" : "opacity-30"}`} aria-hidden />
          ))}
        </div>
        {item.sample && (
          <span className="rounded-full border border-dashed border-ink-soft/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink-soft">
            {sampleLabel}
          </span>
        )}
      </div>
      <blockquote className="text-[15.5px] leading-relaxed">“{te ? item.quote_te : item.quote}”</blockquote>
      <figcaption className="mt-auto flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-gold-bright to-pink font-display text-sm font-bold text-navy">
          {initials(item.name)}
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-bold">{item.name}</span>
          <span className="block truncate text-xs text-ink-soft">
            {te ? item.role_te : item.role} · {te ? item.service_te : item.service}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const { lang, t } = useLanguage();
  const { data = [] } = useQuery({ queryKey: ["testimonials"], queryFn: fetchTestimonials });
  const te = lang === "te";
  const rowA = data.filter((_, i) => i % 2 === 0);
  const rowB = data.filter((_, i) => i % 2 === 1);

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="overflow-hidden py-24 sm:py-32">
      <div className="mx-auto mb-14 max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <p className="font-script text-2xl text-gold">{t.reviews.eyebrow}</p>
            <h2 id="reviews-title" className="mt-1 font-display text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold leading-none tracking-[-0.03em]">
              {t.reviews.title}
            </h2>
          </div>
          <p className="max-w-sm text-ink-soft">{t.reviews.sub}</p>
        </motion.div>
      </div>

      {/* Two rows drifting in opposite directions; pauses on hover */}
      <div className="group flex flex-col gap-5 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        {[rowA, rowB].map((row, r) =>
          row.length ? (
            <div key={r} className="flex overflow-hidden">
              <div
                className={`flex w-max gap-5 pr-5 group-hover:[animation-play-state:paused] ${r ? "animate-[marquee_48s_linear_infinite_reverse]" : "animate-[marquee_42s_linear_infinite]"}`}
              >
                {[...row, ...row].map((item, i) => (
                  <div key={i} aria-hidden={i >= row.length || undefined}>
                    <Card item={item} te={te} sampleLabel={t.reviews.sample} ratingLabel={t.reviews.rating} />
                  </div>
                ))}
              </div>
            </div>
          ) : null,
        )}
      </div>
    </section>
  );
}
