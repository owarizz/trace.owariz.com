"use client";

import { formatDistanceToNow } from "date-fns";
import { Bookmark, Clock, Info } from "lucide-react";
import Image from "next/image";
import { formatSceneTime } from "../controller/anime-scene";
import { useBookmarkStore } from "../controller/bookmark-store";

export function SavedScenesSection() {
    const bookmarks = useBookmarkStore((state) => state.bookmarks);
    const openDetail = useBookmarkStore((state) => state.openDetail);
    const togglePanel = useBookmarkStore((state) => state.togglePanel);

    if (bookmarks.length === 0) {
        return null;
    }

    return (
        <section
            className="animate-fade-in"
            style={{ animationDelay: "0.25s" }}
        >
            <div className="mb-4 flex items-center gap-2.5">
                <Bookmark className="size-4 text-(--text-muted)" />
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-(--text-muted)">
                    Saved Scenes
                </span>
                <div className="h-px flex-1 bg-(--border-subtle)" />
                <button
                    type="button"
                    onClick={togglePanel}
                    className="text-[10px] text-(--text-faint) transition-colors hover:text-(--accent)"
                >
                    View all
                </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                {bookmarks.slice(0, 4).map((item) => (
                    <button
                        type="button"
                        key={item.id}
                        onClick={() =>
                            openDetail({
                                source: "bookmark",
                                ...item,
                            })
                        }
                        className="group flex items-start gap-3 rounded-2xl border border-(--border-subtle) bg-(--bg-glass) p-3 text-left transition-all hover:-translate-y-0.5 hover:border-(--border-default) hover:bg-(--bg-glass-hover)"
                    >
                        <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-xl border border-(--border-subtle) bg-(--bg-elevated)">
                            {item.image ? (
                                <Image
                                    src={`${item.image}?size=s`}
                                    alt={item.title}
                                    fill
                                    sizes="64px"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    referrerPolicy="no-referrer"
                                />
                            ) : null}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <p className="line-clamp-2 text-sm font-semibold leading-snug text-(--text-primary)">
                                        {item.title}
                                    </p>
                                    {item.nativeTitle && (
                                        <p className="mt-0.5 truncate text-xs text-(--text-muted)">
                                            {item.nativeTitle}
                                        </p>
                                    )}
                                </div>

                                <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                                    {(item.similarity * 100).toFixed(0)}%
                                </span>
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-(--text-faint)">
                                {item.episode !== null && (
                                    <span className="rounded bg-(--bg-elevated) px-1.5 py-0.5 font-medium text-(--text-secondary)">
                                        EP {item.episode}
                                    </span>
                                )}
                                <span className="flex items-center gap-1">
                                    <Clock className="size-3" />
                                    {formatSceneTime(item.from)}
                                </span>
                                <span>
                                    saved{" "}
                                    {formatDistanceToNow(item.savedAt, {
                                        addSuffix: true,
                                    })}
                                </span>
                            </div>

                            <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-(--border-subtle) bg-(--bg-elevated) px-2.5 py-1 text-[11px] font-medium text-(--text-muted) transition-all group-hover:border-(--border-default) group-hover:text-(--text-secondary)">
                                <Info className="size-3" />
                                Open saved scene
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </section>
    );
}
