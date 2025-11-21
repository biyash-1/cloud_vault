import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },

  images: {
    domains: [
      "fra.cloud.appwrite.io",
      "cdn-icons-png.flaticon.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.vecteezy.com", // ✅ REQUIRED
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.freepik.com",
      },
       {
        protocol: "https",
        hostname: "as2.ftcdn.net",       // Image icon (your error)
      },
    ],
  },
};

export default nextConfig;
