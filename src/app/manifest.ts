import type { MetadataRoute } from "next";
import { basePath, site } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: `${basePath}/`,
    name: site.name,
    short_name: "Maha Skills",
    description: site.description,
    start_url: `${basePath}/?source=pwa`,
    scope: `${basePath}/`,
    display: "standalone",
    orientation: "portrait",
    background_color: "#070E2B",
    theme_color: "#070E2B",
    categories: ["education", "business", "productivity"],
    icons: [
      { src: `${basePath}/icons/icon-192.png`, sizes: "192x192", type: "image/png", purpose: "any" },
      { src: `${basePath}/icons/icon-512.png`, sizes: "512x512", type: "image/png", purpose: "any" },
      { src: `${basePath}/icons/maskable-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
