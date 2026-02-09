import type { NextConfig } from "next";

const apiBase = process.env.API_BASE_URL;

const nextConfig: NextConfig = {
  output: "standalone",

  async rewrites() {
    if (!apiBase) return [];

    return [
      {
        source: "/cloudfox-api/:path*",
        destination: `${apiBase}/cloudfox-api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;