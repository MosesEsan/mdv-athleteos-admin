import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/athleteos/admin",
  experimental: {
    serverActions: {
      allowedOrigins: ["mesandigitalventures.com", "www.mesandigitalventures.com"],
    },
  },
};

export default nextConfig;
