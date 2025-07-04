import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'designingdreamscapes.com'
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com'
      }
    ],
  },
};

export default nextConfig;