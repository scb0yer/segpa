import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/segpa/:path*",
        destination: "https://site--perso--dzk9mdcz57cb.code.run/segpa/:path*",
      },
    ];
  },
  /* config options here */
};

export default nextConfig;
