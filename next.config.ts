import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/a/**",
      },
      {
        protocol: "https",
        hostname: "keen-skunk-467.convex.cloud",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "rugged-peacock-97.convex.cloud",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
