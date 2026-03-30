import type { Metadata, Viewport } from "next";
import "../assets/globals.css";

import { APP_CONFIG, IBMMono, IBMSans, IBMSansThai } from "@/common";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: dark)", color: "#161616" },
        { media: "(prefers-color-scheme: light)", color: "#161616" }
    ],
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
};

export const metadata: Metadata = {
    metadataBase: new URL(APP_CONFIG.url),
    title: APP_CONFIG.title,
    description: APP_CONFIG.description,
    appleWebApp: {
        title: "Trace",
        statusBarStyle: "black-translucent",
        capable: true,
    },
    openGraph: {
        title: APP_CONFIG.title,
        description: APP_CONFIG.description,
        url: APP_CONFIG.url,
        siteName: "Trace by Owariz",
        type: "website",
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
            <body className="min-h-full flex flex-col">
                {children}
                <Toaster theme="dark" position="bottom-center" toastOptions={{
                    className: "border-(--border-subtle) bg-(--bg-elevated) text-(--text-primary)"
                }} />
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
