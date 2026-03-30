import type { MetadataRoute } from "next";
import { APP_CONFIG } from "@/common/config";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: APP_CONFIG.title,
        short_name: "Trace",
        description: APP_CONFIG.description,
        start_url: "/",
        display: "standalone",
        background_color: "#161616",
        theme_color: "#818cf8",
        icons: [
            {
                src: "/favicon.ico",
                sizes: "any",
                type: "image/x-icon",
            },
        ],
    };
}
