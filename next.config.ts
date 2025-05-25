import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aksd.aacassandra.web.id',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
