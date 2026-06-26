import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a fully static site into `out/` so it can be hosted on GitHub Pages
  // (or any static host). No Node server is required at runtime.
  output: "export",
  // next/image optimization needs a server; static export requires the raw images.
  images: { unoptimized: true },
  // Serve each route as a folder with index.html (plays nicely with static hosts).
  trailingSlash: true,
};

export default nextConfig;
