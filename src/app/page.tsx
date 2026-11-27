"use client";

import { BackToTop } from "@/components/back-to-top";
import { ChatAssistant } from "@/components/chat-assistant";
import { ChatHome } from "@/components/chat-home";
import { ContactCta } from "@/components/contact-cta";
import { Hero } from "@/components/hero";
import { RegisterSection } from "@/components/register-form";
import { Services } from "@/components/services";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Testimonials } from "@/components/testimonials";
import { useSiteStyle } from "@/i18n/site-style";

/**
 * Two page styles share every section below the top:
 *  - "chat"    → LLM-style home (ask Maha first), sections follow for browsing + Google
 *  - "classic" → traditional hero + floating Maha chat
 */
export default function HomePage() {
  const { style } = useSiteStyle();
  const chat = style === "chat";

  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        {chat ? <ChatHome /> : <Hero />}
        <Services />
        <Testimonials />
        <RegisterSection />
        <ContactCta />
      </main>
      <SiteFooter />
      {!chat && <ChatAssistant />}
      <BackToTop />
    </>
  );
}
