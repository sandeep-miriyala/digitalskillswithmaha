"use client";

import Image from "next/image";
import { Heart, Mail } from "lucide-react";
import logo from "../../public/brand/logo.webp";
import { useLanguage } from "@/i18n/language";
import { site } from "@/lib/site";
import { InstagramIcon, WhatsAppIcon, YouTubeIcon } from "./brand-icons";

export function SiteFooter() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  const links = [
    { href: "#home", label: t.nav.home },
    { href: "#services", label: t.nav.services },
    { href: "#reviews", label: t.nav.reviews },
    { href: "#register", label: t.nav.register },
    { href: "#contact", label: t.nav.contact },
  ];

  const socials = [
    { label: "WhatsApp", href: site.links.whatsapp, Icon: WhatsAppIcon },
    { label: "Instagram", href: site.links.instagram, Icon: InstagramIcon },
    { label: "YouTube", href: site.links.youtube, Icon: YouTubeIcon },
    { label: "Email", href: site.links.email, Icon: Mail },
  ];

  return (
    <footer className="border-t border-line bg-bg-soft">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <a href="#home" className="flex items-center gap-3">
            <Image src={logo} alt="" width={48} height={48} className="size-12 rounded-full ring-2 ring-gold/60" />
            <span className="leading-tight">
              <span className="block font-display text-lg font-bold">Digital Skills</span>
              <span className="block font-script text-xl leading-none text-gold">with Maha</span>
            </span>
          </a>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">{t.footer.about}</p>
          <p className="mt-4 font-script text-2xl text-gold">{t.footer.tagline}</p>
        </div>

        <nav aria-label={t.footer.quick}>
          <h2 className="mb-4 text-xs font-extrabold uppercase tracking-[0.16em] text-ink-soft">{t.footer.quick}</h2>
          <ul className="space-y-2.5">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-sm font-semibold transition hover:text-gold">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 text-xs font-extrabold uppercase tracking-[0.16em] text-ink-soft">{t.footer.follow}</h2>
          <ul className="flex flex-wrap gap-2">
            {socials.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid size-11 place-items-center rounded-xl border border-line bg-surface transition hover:-translate-y-0.5 hover:border-gold hover:text-gold"
                >
                  <Icon className="size-5" />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-ink-soft">@{site.handle}</p>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 pb-24 pt-6 text-center text-sm text-ink-soft sm:flex-row sm:pb-6 sm:pl-64 sm:pr-24 sm:text-left">
          <p>
            © {year} {site.name}. {t.footer.rights}
          </p>
          <p className="flex items-center gap-1.5">
            {t.footer.madeWith} <Heart className="size-3.5 fill-pink text-pink" aria-hidden /> {t.footer.made}
          </p>
        </div>
      </div>
    </footer>
  );
}
