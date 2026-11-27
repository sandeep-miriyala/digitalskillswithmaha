/**
 * Single source of truth for brand details and links.
 * Update the TODO values before going live.
 */
export const site = {
  name: "Digital Skills with Maha",
  handle: "digitalskillswithmaha",
  owner: "Maha",
  tagline: "Learn One Skill. Every Day.",
  headline: "Let's Grow Your Business Together!",
  description:
    "Digital Skills with Maha — AI video creation, poster designing, Meta ads and affiliate marketing. Learn one skill, every day.",
  url: "https://sandeep-miriyala.github.io/digitalskillswithmaha",
  links: {
    whatsapp: "https://wa.me/91XXXXXXXXXX", // TODO: same number as enquiry.whatsappNumber
    instagram: "https://www.instagram.com/digitalskillswithmaha", // TODO: confirm handle
    youtube: "https://www.youtube.com/@digitalskillswithmaha", // TODO: confirm handle
    email: "mailto:hello@example.com", // TODO: real email
  },
  pillars: ["Learn", "Create", "Grow", "Succeed"] as const,
  /** Which page style first-time visitors see: "chat" (LLM style) or "classic". Visitors can switch. */
  defaultStyle: "chat" as "chat" | "classic",
  enquiry: {
    /**
     * Free Web3Forms access key — enquiries are emailed to the address you register it with.
     * Get one at https://web3forms.com (no signup, enter Maha's email). Safe to keep in public code.
     * Can also be set via the NEXT_PUBLIC_WEB3FORMS_KEY environment variable.
     */
    web3formsKey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "", // TODO: paste the key inside these quotes: || "your-access-key"
    /** Maha's WhatsApp number for enquiries: country code + number, digits only. */
    whatsappNumber: "91XXXXXXXXXX", // TODO: e.g. 919876543210
  },
};

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a public/ asset path with the GitHub Pages base path. */
export const asset = (path: string) => `${basePath}${path}`;

export const whatsappLink = (text: string) =>
  `${site.links.whatsapp}?text=${encodeURIComponent(text)}`;
