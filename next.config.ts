import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb', // Set your desired size here
    },
  },
  images: {
    domains: ['fra.cloud.appwrite.io','cdn-icons-png.flaticon.com'], // ✅ add your Appwrite host here
  },
  /* config options here */
};

export default nextConfig;
