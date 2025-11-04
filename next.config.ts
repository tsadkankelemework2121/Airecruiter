import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Ensure server-only modules are not bundled for client
  serverExternalPackages: ["openai", "pdf-parse"],
  // Transpile recharts for client-side rendering
  transpilePackages: ["recharts"],
};

export default nextConfig;
