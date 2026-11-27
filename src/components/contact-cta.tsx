"use client";

import { ClipboardList, Mail } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "@/i18n/language";
import { site, whatsappLink } from "@/lib/site";
import { InstagramIcon, WhatsAppIcon, YouTubeIcon } from "./brand-icons";
import { goToRegister } from "./chat-parts";

const channels = [
  { label: "WhatsApp", href: site.links.whatsapp, Icon: WhatsAppIcon, color: "#22b35e" },
  { label: "Instagram", href: site.links.instagram, Icon: InstagramIcon, color: "#e1306c" },
  { label: "YouTube", href: site.links.youtube, Icon: YouTubeIcon, color: "#e03b3b" },
  { label: "Email", href: site.links.email, Icon: Mail, color: "var(--gold)" },
];

export function ContactCta() {
  const { t } = useLanguage();
  const marquee = t.contact.marquee;
  return (
    <section id="contact" aria-labelledby="contact-title" className="py-24 sm:py-32">
      <div className="relative mb-20 overflow-hidden border-y border-line py-5" aria-hidden>
        <div className="flex w-max animate-marquee gap-10 font-display text-3xl font-extrabold tracking-tight text-ink-soft/50 sm:text-4xl">
          {[...marquee, ...marquee].map((m, i) => (
            <span key={i} className="flex items-center gap-10">
              {m}
              <span className="text-gold">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2rem] bg-navy px-7 py-14 text-[#f4f1ea] sm:px-14 sm:py-20"
        >
          <div aria-hidden className="absolute -right-24 -top-24 size-80 rounded-full bg-gold-bright/25 blur-3xl" />
          <div aria-hidden className="absolute -bottom-32 left-10 size-80 rounded-full bg-[#f062a6]/20 blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
            <div>
              <p className="font-script text-3xl text-[#ffd27a]">{t.contact.eyebrow}</p>
              <h2 id="contact-title" className="mt-2 font-display text-[clamp(2.25rem,5vw,4rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">
                {t.hero.headline}
              </h2>
              <p className="mt-5 max-w-lg text-lg text-[#c9cfe8]">
                {t.contact.body}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <a
                href={whatsappLink(t.contact.bookMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#f5b83d] px-7 font-bold text-[#0a1640] transition hover:-translate-y-0.5"
              >
                <WhatsAppIcon className="size-5" />
                {t.contact.book}
              </a>
              <button
                type="button"
                onClick={goToRegister}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-6 font-bold text-[#f4f1ea] transition hover:bg-white/10"
              >
                <ClipboardList className="size-5 text-[#ffd27a]" aria-hidden />
                {t.chatHome.registerNow}
              </button>
              <ul className="grid grid-cols-4 gap-2">
                {channels.map(({ label, href, Icon, color }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={href.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="grid h-14 place-items-center rounded-2xl border border-white/15 bg-white/5 transition hover:-translate-y-0.5 hover:bg-white/10"
                    >
                      <Icon className="size-5" style={{ color }} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
