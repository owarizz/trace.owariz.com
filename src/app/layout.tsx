import type { Metadata } from "next";
import "../assets/globals.css";

import { APP_CONFIG, IBMMono, IBMSans, IBMSansThai } from "@/common";

export const metadata: Metadata = {
    title: APP_CONFIG.title,
    description: APP_CONFIG.description,
    openGraph: {
        title: APP_CONFIG.title,
        description: APP_CONFIG.description,
        url: APP_CONFIG.url,
    },
};

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html
            lang="th"
            className={`${IBMSans.className} ${IBMSansThai.className} ${IBMMono.className} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">{children}</body>
        </html>
    );
}
