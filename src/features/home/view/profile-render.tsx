"use client";

import { Activity, User } from "lucide-react";
import dynamic from "next/dynamic";
import { MeCardSkeleton } from "./me-card/skeleton";

const MeRender = dynamic(
    () => import("./me-card/me-render").then((mod) => mod.MeRender),
    { loading: () => <MeCardSkeleton /> },
);

export function ProfileRender() {
    return (
        <div className="relative min-h-screen overflow-hidden">
            <div className="pointer-events-none fixed inset-0 z-0">
                <div className="absolute -top-[30%] -left-[10%] h-[60vh] w-[50vw] rounded-full bg-indigo-500/5 blur-[120px]" />
                <div className="absolute -right-[15%] top-[10%] h-[50vh] w-[40vw] rounded-full bg-violet-500/4 blur-[120px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-3xl px-6 pb-28 pt-12 sm:pt-16">
                {/* ── Header ── */}
                <header
                    className="mb-8 animate-fade-in"
                    style={{ animationDelay: "0.05s" }}
                >
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-(--accent)/20 bg-(--accent-soft) px-3 py-1">
                        <User className="size-3 text-(--accent)" />
                        <span className="text-[11px] font-medium text-(--accent)">
                            API Profile
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-(--text-primary) sm:text-4xl">
                        <span className="inline-block bg-linear-to-r from-white via-indigo-200 to-violet-200 bg-clip-text text-transparent animate-gradient">
                            System Status
                        </span>
                    </h1>

                    <p className="mt-3 text-sm leading-relaxed text-(--text-secondary)">
                        Live quota and concurrency data for this session's
                        trace.moe API account.
                    </p>
                </header>

                {/* ── API Status ── */}
                <section
                    className="animate-fade-in"
                    style={{ animationDelay: "0.1s" }}
                >
                    <div className="mb-3 flex items-center gap-2.5">
                        <Activity className="size-3.5 text-(--text-muted)" />
                        <span className="text-xs font-medium uppercase tracking-[0.15em] text-(--text-muted)">
                            Account Details
                        </span>
                        <div className="h-px flex-1 bg-(--border-subtle)" />
                    </div>

                    <MeRender />
                </section>

                <footer
                    className="mt-16 text-center animate-fade-in"
                    style={{ animationDelay: "0.2s" }}
                >
                    <p className="text-xs text-(--text-faint)">
                        Data is fetched live on each visit — no caching.
                    </p>
                </footer>
            </div>
        </div>
    );
}
