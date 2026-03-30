import type { MetadataRoute } from "next";
import { APP_CONFIG } from "@/common";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: APP_CONFIG.title,
        short_name: "Trace.moe",
        description: APP_CONFIG.description,
        start_url: "/",
        display: "standalone",
        background_color: "#161616",
        theme_color: "#6366f1",
        icons: [
            {
                src: "/favicon.ico",
                sizes: "any",
                type: "image/x-icon",
            },
        ],
    };
}
