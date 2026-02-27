import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "185.196.21.56",
        port: "8080",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "saridharma.com",
      },
      {
        protocol: "https",
        hostname: "api.saridharma.com",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
