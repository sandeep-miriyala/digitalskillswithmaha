import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Providers } from "@/components/providers";
import { HtmlLang } from "@/i18n/language";
import { basePath, site } from "@/lib/site";
import "./globals.css";

/* Self-hosted open-source fonts (Fontsource, SIL OFL) — no Google Fonts request at build or runtime. */
const bricolage = localFont({
  src: "../../node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2",
  variable: "--font-bricolage",
  weight: "200 800",
  display: "swap",
});

const manrope = localFont({
  src: "../../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
  variable: "--font-manrope",
  weight: "200 800",
  display: "swap",
});

const telugu = localFont({
  src: "../../node_modules/@fontsource-variable/noto-sans-telugu/files/noto-sans-telugu-telugu-wght-normal.woff2",
  variable: "--font-telugu",
  weight: "100 900",
  display: "swap",
});

const caveat = localFont({
  src: [
    { path: "../../node_modules/@fontsource/caveat/files/caveat-latin-600-normal.woff2", weight: "600" },
    { path: "../../node_modules/@fontsource/caveat/files/caveat-latin-700-normal.woff2", weight: "700" },
  ],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: ["digital marketing", "AI video creation", "poster designing", "Meta ads", "affiliate marketing", "Telugu"],
  authors: [{ name: site.owner }],
  manifest: `${basePath}/manifest.webmanifest`,
  appleWebApp: { capable: true, title: "Maha Skills", statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    title: site.name,
    description: site.description,
    siteName: site.name,
    images: [{ url: `${basePath}/og.png`, width: 1200, height: 630, alt: site.name }],
  },
  twitter: { card: "summary_large_image", title: site.name, description: site.description },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf8f1" },
    { media: "(prefers-color-scheme: dark)", color: "#070e2b" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bricolage.variable} ${manrope.variable} ${telugu.variable} ${caveat.variable} antialiased`}
    >
      <body className="grain min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:text-navy"
        >
          Skip to content
        </a>
        <Providers>
          <HtmlLang />
          {children}
        </Providers>
      </body>
    </html>
  );
}
