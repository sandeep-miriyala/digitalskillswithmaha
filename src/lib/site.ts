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
    whatsapp: "https://wa.me/91XXXXXXXXXX", // TODO: real number, e.g. 919876543210
    instagram: "https://www.instagram.com/digitalskillswithmaha", // TODO: confirm handle
    youtube: "https://www.youtube.com/@digitalskillswithmaha", // TODO: confirm handle
    email: "mailto:hello@example.com", // TODO: real email
  },
  pillars: ["Learn", "Create", "Grow", "Succeed"] as const,
} as const;

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a public/ asset path with the GitHub Pages base path. */
export const asset = (path: string) => `${basePath}${path}`;

export const whatsappLink = (text: string) =>
  `${site.links.whatsapp}?text=${encodeURIComponent(text)}`;
