import type { NextConfig } from "next";

const SECURITY_HEADERS = [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "X-XSS-Protection", value: "1; mode=block" },
    {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
    },
    {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
    },
];

const nextConfig: NextConfig = {
    experimental: {
        optimizePackageImports: ["date-fns", "lucide-react"],
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: SECURITY_HEADERS,
            },
        ];
    },
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
