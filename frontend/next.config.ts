import type { NextConfig } from "next";

const isDev = process.env.NEXT_CONFIG_ENV !== "production";

const nextConfig: NextConfig = {
  "output": isDev ? undefined : "standalone",
  "allowedDevOrigins": [
    "local.kabir.dev",
  ],
};

export default nextConfig;
