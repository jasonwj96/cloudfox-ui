import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  output: "standalone",

  async rewrites() {
    if (!isDev) return [];

    return [
      {
        source: "/cloudfox-api/:path*",
        destination: "http://localhost:8080/cloudfox-api/:path*",
      },
    ];
  },
};

export default nextConfig;