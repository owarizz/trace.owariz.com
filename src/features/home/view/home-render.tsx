import { Activity, ExternalLink, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { APP_CONFIG } from "@/common/config/site";
import { BookmarkBar } from "./bookmark-bar";
import { SavedScenesSection } from "./saved-scenes-section";
import { SearchRender } from "./search-card";
import { StatusPanel } from "./status-panel";

interface HomeRenderProps {
    initialUrl?: string;
}

export function HomeRender({ initialUrl }: HomeRenderProps) {
    return (
        <div className="relative min-h-screen overflow-hidden">
            <div className="pointer-events-none fixed inset-0 z-0">
                <div className="absolute -top-[40%] -left-[20%] h-[80vh] w-[60vw] rounded-full bg-indigo-500/7 blur-[120px]" />
                <div className="absolute -right-[20%] top-[20%] h-[60vh] w-[50vw] rounded-full bg-violet-500/5 blur-[120px]" />
                <div className="absolute -bottom-[20%] left-[30%] h-[50vh] w-[40vw] rounded-full bg-fuchsia-500/4 blur-[100px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-2xl px-6 py-12 sm:py-16">
                <header className="mb-10 animate-fade-in">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-(--border-default) bg-(--accent-soft) px-3 py-1">
                                <Sparkles className="size-3 text-(--accent)" />
                                <span className="text-[11px] font-medium text-(--accent)">
                                    v{APP_CONFIG.version}
                                </span>
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight text-(--text-primary) sm:text-4xl">
                                <span className="inline-block bg-linear-to-r from-white via-indigo-200 to-violet-200 bg-clip-text text-transparent animate-gradient">
                                    {APP_CONFIG.title}
                                </span>
                            </h1>

                            <p className="mt-2 max-w-md text-sm leading-relaxed text-(--text-secondary)">
                                {APP_CONFIG.description}
                            </p>
                        </div>

                        <div className="mt-1 flex items-center gap-2">
                            <Link
                                href="/updates"
                                prefetch
                                className="inline-flex items-center gap-1.5 rounded-lg border border-(--accent)/30 bg-(--accent-soft) px-3 py-1.5 text-[11px] font-semibold text-(--accent) transition-all hover:border-(--accent) hover:brightness-110 active:scale-95"
                            >
                                Updates
                            </Link>
                            <BookmarkBar />
                            <a
                                href={APP_CONFIG.github.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-(--border-subtle) bg-(--bg-glass) px-3 py-1.5 text-[11px] font-medium text-(--text-muted) transition-all hover:border-(--border-default) hover:bg-(--bg-glass-hover) hover:text-(--text-secondary) active:scale-95"
                            >
                                <ExternalLink className="size-3" />
                                GitHub
                            </a>
                        </div>
                    </div>
                </header>

                <section className="mb-10">
                    <div
                        className="mb-5 flex items-center gap-2.5 animate-fade-in"
                        style={{ animationDelay: "0.05s" }}
                    >
                        <Search className="size-4 text-(--text-muted)" />
                        <span className="text-xs font-medium uppercase tracking-[0.15em] text-(--text-muted)">
                            Scene Search
                        </span>
                        <div className="h-px flex-1 bg-(--border-subtle)" />
                        <kbd className="hidden rounded border border-(--border-default) bg-(--bg-elevated) px-1.5 py-0.5 text-[10px] font-mono text-(--text-faint) sm:inline-block">
                            /
                        </kbd>
                    </div>
                    <div
                        className="animate-fade-in-up"
                        style={{ animationDelay: "0.1s" }}
                    >
                        <SearchRender initialUrl={initialUrl} />
                    </div>
                </section>

                <div className="mb-10">
                    <SavedScenesSection />
                </div>

                <section
                    className="animate-fade-in"
                    style={{ animationDelay: "0.3s" }}
                >
                    <div className="mb-5 flex items-center gap-2.5">
                        <Activity className="size-4 text-(--text-muted)" />
                        <span className="text-xs font-medium uppercase tracking-[0.15em] text-(--text-muted)">
                            System Status
                        </span>
                        <div className="h-px flex-1 bg-(--border-subtle)" />
                    </div>
                    <StatusPanel />
                </section>

                <footer
                    className="mt-16 text-center animate-fade-in"
                    style={{ animationDelay: "0.4s" }}
                >
                    <p className="text-xs text-(--text-faint)">
                        {APP_CONFIG.copyright}
                    </p>
                </footer>
            </div>
        </div>
    );
}
