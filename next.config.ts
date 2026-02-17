import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export using `next export`
  output: "export",
  // Ensure built-in Image component works without the Image Optimization Infrastructure
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
