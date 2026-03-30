import { author, version } from "../../../package.json";

export const APP_CONFIG = {
    title: "Trace",
    description:
        "Anime scene search for screenshots and clips powered by trace.moe.",
    url: "https://trace.owariz.com",
    traceApiBaseUrl: "https://api.trace.moe",
    version,
    authors: [
        {
            name: author.name,
            email: author.email,
            url: "https://owariz.com",
        },
    ],
    copyright: "(c) 2026 Trace. All rights reserved.",
} as const;
