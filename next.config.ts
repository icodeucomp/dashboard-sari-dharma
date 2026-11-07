import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ? new URL(process.env.NEXT_PUBLIC_API_URL) : null;

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      ...(apiUrl
        ? [
            {
              protocol: apiUrl.protocol.replace(":", "") as "http" | "https",
              hostname: apiUrl.hostname,
              port: apiUrl.port,
              pathname: "/**",
            },
          ]
        : []),
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
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
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
