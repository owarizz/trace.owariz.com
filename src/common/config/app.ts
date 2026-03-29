import {
    IBM_Plex_Mono,
    IBM_Plex_Sans,
    IBM_Plex_Sans_Thai,
} from "next/font/google";
import { author, version } from "../../../package.json";

export const IBMSans = IBM_Plex_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    style: ["normal"],
    display: "swap",
});

export const IBMMono = IBM_Plex_Mono({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    style: ["normal"],
    display: "swap",
});

export const IBMSansThai = IBM_Plex_Sans_Thai({
    subsets: ["thai"],
    weight: ["400", "500", "600", "700"],
    style: ["normal"],
    display: "swap",
});

export const APP_CONFIG = {
    title: "Trace",
    description:
        "A modern, open-source, self-hosted, and privacy-focused analytics platform.",
    url: "https://trace.owariz.com",
    version: version,
    authors: [
        {
            name: author.name,
            email: author.email,
            url: "https://owariz.com",
        },
    ],
    copyright: "© 2026 Trace. All rights reserved.",
};
