import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // TODO: Revisit this after deployment.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default nextConfig;
