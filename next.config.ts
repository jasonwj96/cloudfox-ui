import type { NextConfig } from "next";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

const nextConfig: NextConfig = {
  output: "standalone",

  async rewrites() {
    if (!apiBase) return [];

    return [
      {
        source: "/api/:path*",
        destination: `${apiBase}/:path*`,
      },
    ];
  },
};

export default nextConfig;
