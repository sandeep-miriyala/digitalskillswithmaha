import type { SVGProps } from "react";

/* Lucide no longer ships brand marks, so these are simple outline versions. */
type IconProps = SVGProps<SVGSVGElement>;

const base: IconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const WhatsAppIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M3.5 20.5l1.3-4.1A8.5 8.5 0 1 1 8 19.6l-4.5.9z" />
    <path d="M9 9.2c.2 1.9 1.9 4 3.9 4.9l1.2-1 1.9 1-.4 1.4c-2.9.6-6.9-3.3-6.4-6.3l1.3-.6.9 1.8-.9 1" />
  </svg>
);

export const InstagramIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </svg>
);

export const YouTubeIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="2" y="5" width="20" height="14" rx="4" />
    <path d="M10 9.2l5 2.8-5 2.8z" fill="currentColor" />
  </svg>
);
