import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  eslint: { ignoreDuringBuilds: true },
  transpilePackages: ["mapbox-gl"],
};

export default nextConfig;
