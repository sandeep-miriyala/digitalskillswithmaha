import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages.
 * NEXT_PUBLIC_BASE_PATH is set by the GitHub Actions workflow
 * ("/digitalskillswithmaha" for a project site, "" for a custom domain).
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
