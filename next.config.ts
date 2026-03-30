import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**.trace.moe",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "**.anilist.co",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "**.anili.st",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "**.githubusercontent.com",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
