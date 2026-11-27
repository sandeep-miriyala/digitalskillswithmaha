/**
 * Single source of truth for brand details and links.
 */

/** Maha's WhatsApp number: country code + 10 digits, digits only. Change it ONLY here. */
const MAHA_WHATSAPP = "919966610329";

/** Free Web3Forms access key (https://web3forms.com, enter the email that should receive enquiries). */
const WEB3FORMS_KEY = ""; // ← paste the key inside the quotes, e.g. "a1b2c3d4-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

export const site = {
  name: "Digital Skills with Maha",
  handle: "digitalskillswithmaha",
  owner: "Maha",
  tagline: "Learn One Skill. Every Day.",
  headline: "Let's Grow Your Business Together!",
  description:
    "Digital Skills with Maha — AI video creation, poster designing, Meta ads and affiliate marketing. Learn one skill, every day.",
  url: "https://sandeep-miriyala.github.io/digitalskillswithmaha/llm",
  links: {
    whatsapp: `https://wa.me/${MAHA_WHATSAPP}`,
    instagram: "https://www.instagram.com/digitalskillswithmaha", // TODO: confirm handle
    youtube: "https://www.youtube.com/@digitalskillswithmaha", // TODO: confirm handle
    email: "mailto:mahalakshmi.222@gmail.com",
  },
  pillars: ["Learn", "Create", "Grow", "Succeed"] as const,
  /** Which page style first-time visitors see: "chat" (LLM style) or "classic". Visitors can switch. */
  defaultStyle: "chat" as "chat" | "classic",
  enquiry: {
    /** Enquiries are emailed to the address the Web3Forms key was created with. Safe to keep in public code. */
    web3formsKey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY || WEB3FORMS_KEY,
    /** Maha's WhatsApp number for enquiries (same as above). */
    whatsappNumber: MAHA_WHATSAPP,
  },
};

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a public/ asset path with the GitHub Pages base path. */
export const asset = (path: string) => `${basePath}${path}`;

export const whatsappLink = (text: string) =>
  `${site.links.whatsapp}?text=${encodeURIComponent(text)}`;
