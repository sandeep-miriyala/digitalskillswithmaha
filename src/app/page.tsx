import { BackToTop } from "@/components/back-to-top";
import { ChatAssistant } from "@/components/chat-assistant";
import { ContactCta } from "@/components/contact-cta";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Testimonials } from "@/components/testimonials";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Services />
        <Testimonials />
        <ContactCta />
      </main>
      <SiteFooter />
      <ChatAssistant />
      <BackToTop />
    </>
  );
}
