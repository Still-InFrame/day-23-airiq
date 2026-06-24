import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so a stray package-lock.json in a parent dir can't
  // mislead Turbopack (see CLAUDE.md gotcha).
  turbopack: { root: __dirname },
};

export default nextConfig;
