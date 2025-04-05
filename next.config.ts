import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aksd.sytes.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
