import type { NextConfig } from "next";

/**
 * Static export: `npm run build` writes plain HTML/CSS/JS to `out/`,
 * which GitHub Pages serves as-is. The site lives under /harshgupta
 * on Pages, so the deploy workflow sets NEXT_PUBLIC_BASE_PATH.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
};

export default nextConfig;
