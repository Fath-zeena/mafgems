import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "awnihpkyjmycjehgsnzo.supabase.co",
      },
    ],
  },
  allowedDevOrigins: [
    "https://*.preview.emergentagent.com",
    "https://*.stage-preview.emergentagent.com",
  ],
};

export default nextConfig;